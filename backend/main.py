from config import app, db
from flask_cors import CORS
import routes

# This is a more explicit CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}})

# This function will run after every request
# It adds headers to tell Vercel and browsers not to cache the API responses


@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
