from flask import request, jsonify
from config import app, db
from models import Friend, Trip, Participation, Car, Setting, Payment
from collections import defaultdict
from datetime import datetime

# --- Helper Functions ---
ALLOWED_DIRECTIONS = {"round", "morning", "evening"}


def direction_weight(direction: str) -> float:
    if direction == "round":
        return 2.0
    if direction in {"morning", "evening"}:
        return 1.0
    return 0.0

# --- Friend Routes ---


@app.route("/friends", methods=["GET", "POST"])
def handle_friends():
    if request.method == "GET":
        friends = Friend.query.order_by(Friend.name.asc()).all()
        return jsonify([f.to_json() for f in friends]), 200
    if request.method == "POST":
        data = request.get_json(force=True) or {}
        name = (data.get("name") or "").strip()
        if not name:
            return jsonify({"message": "name is required"}), 400
        if Friend.query.filter_by(name=name).first():
            return jsonify({"message": "friend with that name already exists"}), 409
        f = Friend(name=name)
        db.session.add(f)
        db.session.commit()
        return jsonify(f.to_json()), 201


@app.route("/friends/<int:friend_id>", methods=["DELETE"])
def delete_friend(friend_id):
    f = Friend.query.get(friend_id)
    if not f:
        return jsonify({"message": "friend not found"}), 404
    db.session.delete(f)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200

# --- Car Routes ---


@app.route("/cars", methods=["GET", "POST"])
def handle_cars():
    if request.method == "GET":
        cars = Car.query.order_by(Car.name.asc()).all()
        return jsonify([c.to_json() for c in cars]), 200
    if request.method == "POST":
        data = request.get_json(force=True) or {}
        name = (data.get("name") or "").strip()
        mileage = data.get("mileage")
        if not name or mileage is None:
            return jsonify({"message": "name and mileage are required"}), 400
        if Car.query.filter_by(name=name).first():
            return jsonify({"message": "car with that name already exists"}), 409
        try:
            mileage = float(mileage)
            if mileage <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return jsonify({"message": "mileage must be a positive number"}), 400
        car = Car(name=name, mileage=mileage)
        db.session.add(car)
        db.session.commit()
        return jsonify(car.to_json()), 201

# --- Settings Routes ---


def get_setting(key, default_value):
    setting = Setting.query.get(key)
    if not setting:
        setting = Setting(key=key, value=str(default_value))
        db.session.add(setting)
        db.session.commit()
    return setting


@app.route("/settings/petrol_price", methods=["GET", "PUT"])
def handle_petrol_price():
    if request.method == "GET":
        price_setting = get_setting("petrol_price", "105.87")
        return jsonify({"price": float(price_setting.value)})
    if request.method == "PUT":
        data = request.get_json(force=True) or {}
        new_price = data.get("price")
        try:
            new_price = float(new_price)
            if new_price <= 0:
                raise ValueError()
        except (ValueError, TypeError):
            return jsonify({"message": "price must be a positive number"}), 400
        price_setting = get_setting("petrol_price", "105.87")
        price_setting.value = str(new_price)
        db.session.commit()
        return jsonify({"price": new_price})

# --- Trip Routes ---


@app.route("/trips", methods=["GET", "POST"])
def handle_trips():
    if request.method == "GET":
        trips = Trip.query.order_by(Trip.date.desc(), Trip.id.desc()).all()
        payload = []
        for t in trips:
            payload.append({
                **t.to_json(),
                "participants": [p.to_json() for p in t.participants]
            })
        return jsonify(payload), 200

    if request.method == "POST":
        data = request.get_json(force=True) or {}
        total_kms, car_id = data.get("total_kms"), data.get("car_id")
        date, driver_id = data.get("date", "").strip(), data.get("driver_id")
        participants = data.get("participants", [])
        if not all([date, total_kms is not None, driver_id, car_id]):
            return jsonify({"message": "date, total_kms, driver_id, and car_id are required"}), 400
        try:
            total_kms = float(total_kms)
            if total_kms < 0:
                raise ValueError()
        except (ValueError, TypeError):
            return jsonify({"message": "total_kms must be a non-negative number"}), 400
        car = Car.query.get(car_id)
        if not car:
            return jsonify({"message": "car not found"}), 404
        petrol_price = float(get_setting("petrol_price", "105.87").value)
        total_cost = (total_kms / car.mileage) * petrol_price
        trip = Trip(date=date, total_kms=total_kms,
                    total_cost=total_cost, driver_id=driver_id, car_id=car_id)
        db.session.add(trip)
        db.session.flush()
        for p in participants:
            if not Friend.query.get(p.get("friend_id")):
                db.session.rollback()
                return jsonify({"message": f"friend_id {p.get('friend_id')} does not exist"}), 400
            db.session.add(Participation(trip_id=trip.id, friend_id=p.get(
                "friend_id"), direction=p.get("direction")))
        db.session.commit()
        return jsonify(trip.to_json()), 201

# --- Payment Routes ---


@app.route("/payments", methods=["POST"])
def create_payment():
    data = request.get_json(force=True) or {}
    from_id, to_id, amount = data.get(
        "from_id"), data.get("to_id"), data.get("amount")
    if not all([from_id, to_id, amount]):
        return jsonify({"message": "from_id, to_id, and amount are required"}), 400
    payment_date = datetime.utcnow().strftime('%Y-%m-%d')
    payment = Payment(from_friend_id=from_id, to_friend_id=to_id,
                      amount=float(amount), date=payment_date)
    db.session.add(payment)
    db.session.commit()
    return jsonify({"message": "Payment recorded"}), 201

# --- Calculation Routes ---


@app.route("/balances", methods=["GET"])
def get_balances():
    balances = defaultdict(float)
    friends = {f.id: f for f in Friend.query.all()}
    for trip in Trip.query.all():
        if not trip.participants:
            continue
        total_weight = sum(direction_weight(p.direction)
                           for p in trip.participants)
        if total_weight == 0:
            continue
        cost_per_share = trip.total_cost / total_weight
        balances[trip.driver_id] += trip.total_cost
        for p in trip.participants:
            balances[p.friend_id] -= direction_weight(
                p.direction) * cost_per_share

    # Corrected payment logic
    for payment in Payment.query.all():
        balances[payment.from_friend_id] -= payment.amount
        balances[payment.to_friend_id] += payment.amount

    debtors = {id: b for id, b in balances.items() if b < 0}
    creditors = {id: b for id, b in balances.items() if b > 0}
    debts = []


@app.route("/expenses", methods=["GET"])
def get_monthly_expenses():
    year, month = request.args.get("year"), request.args.get("month")
    if not year or not month:
        return jsonify({"message": "Year and month query parameters are required"}), 400
    date_prefix = f"{year}-{int(month):02d}"
    monthly_trips = Trip.query.filter(Trip.date.startswith(date_prefix)).all()
    expenses = defaultdict(float)
    for trip in monthly_trips:
        if not trip.participants:
            continue
        total_weight = sum(direction_weight(p.direction)
                           for p in trip.participants)
        if total_weight == 0:
            continue
        cost_per_share = trip.total_cost / total_weight
        for p in trip.participants:
            expenses[p.friend.name] += direction_weight(
                p.direction) * cost_per_share
    expense_list = [{"name": name, "amount": round(
        amount, 2)} for name, amount in expenses.items()]
    return jsonify(sorted(expense_list, key=lambda x: x['amount'], reverse=True)), 200
