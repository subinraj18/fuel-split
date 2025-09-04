from config import app, db
from flask_cors import CORS
import routes  # This registers the routes from routes.py

# Enable Cross-Origin Resource Sharing (CORS) for the app
CORS(app)

if __name__ == "__main__":
    with app.app_context():
        # This will create the database and tables if they don't exist
        db.create_all()
    # This runs the development server
    app.run(debug=True, port=5000)
