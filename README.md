---

# Weather Monitoring Application

This is a simple web-based weather monitoring application that allows users to log in, add cities to monitor weather conditions, view historical trends, and delete cities from the monitoring list. The application utilizes a free/open weather API to access weather data for cities across the globe.
Backend is hosted on Render and Frontend is hosted on Github Pages.

Live Website - https://nobita006.github.io/weather_monitoring_app/


## Screen Recording


https://github.com/Nobita006/weather_monitoring_app/assets/110232335/d5875905-b813-4f07-9bf2-4ad54d924758


## Features

- User authentication: Users can log in using a username and password.
- City management: Users can add, delete, and view a list of cities they are monitoring.
- Real-time weather data: The application displays the most recent temperature and relative humidity values for each monitored city.
- Historical trends: Users can view/download historical trends of temperature and humidity for each city.
- Interactive map: The application includes a world map that marks all monitored cities, and users can hover over a city to view its weather data in a small popup window.

## Technologies Used

### Frontend
- HTML/CSS/JavaScript
- Leaflet.js for interactive map
- Chart.js for data visualization

### Backend
- Flask (Python) for the backend server
- SQLite database for data storage
- APScheduler for scheduling weather data updates
- Requests library for API requests
- Flask-CORS for enabling Cross-Origin Resource Sharing (CORS)

## Prerequisites

To run this application, you need to have the following installed:

- Python 3
- Flask (`pip install Flask`)
- flask_cors (`pip install flask_cors`)
- APScheduler (`pip install apscheduler`)
- Requests (`pip install requests`)
- SQLite3 (usually comes pre-installed with Python)

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Initialize a Virtual Environment
    ```
    python3 -m venv env
    source env/bin/activate  # For Linux/Mac
    # Or, env\Scripts\activate  # For Windows

    ```
4. Install the required dependencies using `pip install -r requirements.txt`.
5. Run the backend server by executing `python app.py`.
6. Open `index.html` in your web browser to access the frontend.
7. If `weather_data.db` is deleted accidentally run `initializeDb.py` to recreate Database.

## API Used

- WeatherAPI (https://www.weatherapi.com/) - Used to fetch real-time weather data for cities.
- Geocoding API (https://api-ninjas.com/api/geocoding) - Used to convert city name to latitude and longitude coordinates.

## Usage

1. Log in using your username and password. 
    ```
    username = user1    password = password1

    username = user2    password = password2
    ```
2. On the home screen, you can view a list of cities you are tracking, along with their current weather information.
3. Click on "Add City" to search for and add new cities to monitor.
4. Click on an existing city to view its detailed weather information and historical trends.
5. Use the interactive map to visualize the locations of all monitored cities.

---
