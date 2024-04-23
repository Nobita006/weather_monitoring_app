import requests
from flask import Flask, request, session, jsonify
from database import *
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
# Enable CORS for all routes
CORS(app)
app.teardown_appcontext(close_db)
app.secret_key = 'sayan@das'

# Hardcoded user credentials (for demonstration purposes)
users = {'user1': 'password1', 'user2': 'password2'}

# Function to update weather data for all cities in the database
def update_weather_data():
    with app.app_context():  # Ensure to work within the application context
        cities = get_cities()
        for city in cities:
            fetch_weather_data(city['name'])

# Initialize scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=update_weather_data, trigger="interval", minutes=60)  
scheduler.start()

# Login route
@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    # Check if username and password are valid
    if username in users and users[username] == password:
        session['logged_in'] = True
        session['username'] = username
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Logout route
@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return jsonify({'message': 'Logout successful'})

# Route to check if user is logged in
@app.route('/check_login')
def check_login():
    if session.get('logged_in'):
        return jsonify({'logged_in': True, 'username': session['username']})
    else:
        return jsonify({'logged_in': False})

# Function to fetch weather data from API and insert into the database
def fetch_weather_data(city_name):
    api_key = 'bb27260bf73648948cb130741242204'
    base_url = 'http://api.weatherapi.com/v1'
    endpoint = '/current.json'

    params = {
        'key': api_key,
        'q': city_name
    }

    response = requests.get(base_url + endpoint, params=params)
    data = response.json()

    # Extract relevant data (temperature and humidity)
    if 'error' in data:
        raise ValueError('City not found')
    
    temperature = data['current']['temp_c']
    humidity = data['current']['humidity']

    # Insert or update data into the database
    upsert_city(city_name, temperature, humidity)

# Route to fetch all cities from the database
@app.route('/cities')
def cities():
    cities = get_cities()
    # Convert data to JSON format and return
    return jsonify(cities)

# Route to handle adding new cities
@app.route('/cities/add', methods=['POST'])
def add_city():
    # Get city name from the request data
    city_name = request.json.get('name')
    
    # Check if the city already exists in the database
    existing_city = get_city_by_name(city_name)
    if existing_city:
        return jsonify({'error': 'City already exists'}), 409
    
    # Check if city name is provided
    if not city_name:
        return jsonify({'error': 'City name is required'}), 400
    
    try:
        # Fetch weather data and insert into the database
        fetch_weather_data(city_name)
        return jsonify({'message': 'City added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to handle deleting a city
@app.route('/cities/delete/<city_name>', methods=['DELETE'])
def delete_city(city_name):
    # Delete the city from the database
    try:
        delete_city_by_name(city_name)
        return jsonify({'message': 'City deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
