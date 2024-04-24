import sqlite3
from flask import g

# Function to get SQLite connection
def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect('weather_data.db')
        g.db.row_factory = sqlite3.Row
    return g.db

# Function to close SQLite connection
def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

# Function to initialize database
def init_db():
    db = get_db()
    with open('backend\schema.sql', 'r') as f:
        db.executescript(f.read())

# Function to insert or update city data into the database
def upsert_city(name, temperature, humidity):
    db = get_db()
    cursor = db.execute('''SELECT * FROM cities WHERE name = ?''', (name,))
    existing_city = cursor.fetchone()
    if existing_city:
        db.execute('''UPDATE cities SET temperature = ?, humidity = ? WHERE name = ?''', (temperature, humidity, name))
    else:
        db.execute('''INSERT INTO cities (name, temperature, humidity) VALUES (?, ?, ?)''', (name, temperature, humidity))
    db.commit()

# Function to fetch all cities from the database
def get_cities():
    db = get_db()
    cursor = db.execute('''SELECT * FROM cities''')
    cities = [dict(row) for row in cursor.fetchall()]
    return cities

# Function to delete a city by name
def delete_city_by_name(name):
    db = get_db()
    db.execute('''DELETE FROM cities WHERE name = ?''', (name,))
    db.commit()

# Function to fetch a city by name from the database
def get_city_by_name(name):
    db = get_db()
    cursor = db.execute('''SELECT * FROM cities WHERE name = ?''', (name,))
    city = cursor.fetchone()
    return city

# Function to fetch historical data for a city
def get_city_history(name):
    db = get_db()
    cursor = db.execute('''SELECT timestamp, temperature, humidity FROM city_history WHERE name = ? ORDER BY timestamp ASC''', (name,))
    history = [dict(row) for row in cursor.fetchall()]
    return history
