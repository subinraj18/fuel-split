from config import db


class Friend(db.Model):
    __tablename__ = "friends"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)

    def to_json(self):
        return {"id": self.id, "name": self.name}


class Car(db.Model):
    __tablename__ = "cars"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    mileage = db.Column(db.Float, nullable=False)  # In km per liter

    def to_json(self):
        return {"id": self.id, "name": self.name, "mileage": self.mileage}


class Setting(db.Model):
    __tablename__ = "settings"
    key = db.Column(db.String(50), primary_key=True)
    value = db.Column(db.String(120), nullable=False)


class Trip(db.Model):
    __tablename__ = "trips"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)

    total_kms = db.Column(db.Float, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)

    driver_id = db.Column(db.Integer, db.ForeignKey(
        "friends.id"), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey("cars.id"), nullable=False)

    driver = db.relationship("Friend", foreign_keys=[driver_id])
    car = db.relationship("Car")

    def to_json(self):
        return {
            "id": self.id,
            "date": self.date,
            "total_kms": self.total_kms,
            "total_cost": self.total_cost,
            "driver": self.driver.to_json() if self.driver else None,
            "car": self.car.to_json() if self.car else None
        }


class Participation(db.Model):
    __tablename__ = "participations"
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(
        "friends.id"), nullable=False)
    direction = db.Column(db.String(10), nullable=False)

    trip = db.relationship("Trip", backref=db.backref(
        "participants", cascade="all, delete-orphan"))
    friend = db.relationship("Friend", backref=db.backref(
        "participations", cascade="all, delete-orphan"))

    def to_json(self):
        return {
            "id": self.id,
            "trip_id": self.trip_id,
            "friend": self.friend.to_json(),
            "direction": self.direction
        }
# Add this new class to the end of your models.py file


class Payment(db.Model):
    __tablename__ = "payments"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    from_friend_id = db.Column(
        db.Integer, db.ForeignKey("friends.id"), nullable=False)
    to_friend_id = db.Column(
        db.Integer, db.ForeignKey("friends.id"), nullable=False)

    from_friend = db.relationship("Friend", foreign_keys=[from_friend_id])
    to_friend = db.relationship("Friend", foreign_keys=[to_friend_id])
