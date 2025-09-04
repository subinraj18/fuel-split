from config import app, db
from flask_cors import CORS
import routes

# This is a more explicit CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
