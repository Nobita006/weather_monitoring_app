// JavaScript code for frontend functionality

// Function to perform user login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `username=${username}&password=${password}`
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('homeScreen').style.display = 'block';
            document.getElementById('loggedInUser').textContent = username;
            document.getElementById('loggedInUserHeader').textContent = `Logged in as ${username}`;
            fetchCityList();
            // Store login state in local storage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
        } else {
            document.getElementById('loginError').textContent = 'Invalid username or password';
            document.getElementById('loginError').classList.remove('hidden');
        }
    })
    .catch(error => console.error('Error logging in:', error));
}

// Function to handle user logout
function logout() {
    fetch('http://127.0.0.1:5000/logout')
    .then(response => {
        if (response.ok) {
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('homeScreen').style.display = 'none';
            // Clear login state from local storage
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
        } else {
            alert('Error logging out');
        }
    })
    .catch(error => console.error('Error logging out:', error));
}

// Function to toggle between screens
function toggleScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id === screenId) {
            screen.classList.remove('hidden');
        } else {
            screen.classList.add('hidden');
        }
    });
}

// Function to fetch city list from backend API
function fetchCityList() {
    fetch('http://127.0.0.1:5000/cities') 
        .then(response => response.json())
        .then(data => {
            const cityListDiv = document.getElementById('cityList');
            cityListDiv.innerHTML = '';

            data.forEach(city => {
                const cityDiv = document.createElement('div');
                cityDiv.classList.add('cityItem');
                cityDiv.innerHTML = `<p>${capitalizeFirstLetter(city.name)}</p>
                                     <p>Temperature: ${city.temperature}°C ${getTemperatureIcon(city.temperature)}</p>
                                     <p>Humidity: ${city.humidity}%</p>
                                     <button class="deleteBtn" onclick="deleteCity('${city.name}')">Delete</button>`;
                cityListDiv.appendChild(cityDiv);
            });
        })
        .catch(error => console.error('Error fetching city list:', error));
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to get temperature icon based on temperature value
function getTemperatureIcon(temperature) {
    if (temperature > 40) {
        return '<img src="images\\redTherm.png" alt="Hot">';
    } else if (temperature > 28) {
        return '<img src="images\\blackTherm.png" alt="Normal">';
    } else {
        return '<img src="images\\greenTherm.png" alt="Pleasant">';
    }
}

// Function to add a city
function addCity(cityName) {
    fetch('http://127.0.0.1:5000/cities/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: capitalizeFirstLetter(cityName) })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Return the response data
        } else {
            throw new Error('Error adding city');
        }
    })
    .then(data => {
        fetchCityList(); // Fetch city list after successfully adding the city
    })
    .catch(error => console.error('Error adding city:', error));
}

// Function to delete a city
function deleteCity(cityName) {
    if (confirm(`Are you sure you want to delete ${cityName}?`)) {
        fetch(`http://127.0.0.1:5000/cities/delete/${cityName}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Return the response data
            } else {
                throw new Error('Error deleting city');
            }
        })
        .then(data => {
            fetchCityList(); // Fetch city list after successfully deleting the city
        })
        .catch(error => console.error('Error deleting city:', error));
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');

    if (loggedIn === 'true' && username) {
        document.getElementById('loggedInUser').textContent = username;
        document.getElementById('loggedInUserHeader').textContent = `Logged in as ${username}`;
        fetchCityList();
        toggleScreen('homeScreen');
    } else {
        toggleScreen('loginContainer');
    }
});

// Initialize Add City button
document.getElementById('addCityBtn').addEventListener('click', function() {
    const cityName = prompt('Enter the name of the city:');
    if (cityName) {
        addCity(cityName);
    }
});
