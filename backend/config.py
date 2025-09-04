from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Set up the base directory
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + \
    os.path.join(BASE_DIR, "splitapp.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database object
db = SQLAlchemy(app)
