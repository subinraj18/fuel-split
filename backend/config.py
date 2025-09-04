import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(_name_)

# This line checks for the live database URL provided by Render
database_url = os.environ.get("DATABASE_URL")

# This is a small fix needed for Render's PostgreSQL URLs
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

# Configure the database:
# IF the database_url exists (on Render), use it.
# ELSE (on your local computer), use the sqlite file.
app.config["SQLALCHEMY_DATABASE_URI"] = database_url or "sqlite:///" + \
    os.path.join(os.path.abspath(os.path.dirname(_file_)), "splitapp.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
