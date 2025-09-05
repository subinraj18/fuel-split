from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# --- CHANGE THIS ---
# Get the database URL from an environment variable, or use a default
# For local development, you might set this variable. For production, your host sets it.
DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'postgresql://neondb_owner:npg_Faj3ZBsvWg0Q@ep-broad-cell-ad2e2zky-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'  # Paste your string here
)

# The postgresql:// protocol is for Heroku, Neon uses postgres://
# This line ensures it works on both.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
