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
            fetchCityList();
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
                cityDiv.innerHTML = `<p>${city.name}</p>
                                     <p>Temperature: ${city.temperature}°C</p>
                                     <p>Humidity: ${city.humidity}%</p>
                                     <button class="deleteBtn" onclick="deleteCity('${city.name}')">Delete</button>`;
                cityListDiv.appendChild(cityDiv);
            });
        })
        .catch(error => console.error('Error fetching city list:', error));
}

// Function to add a city
function addCity(cityName) {
    fetch('http://127.0.0.1:5000/cities/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: cityName })
    })
    .then(response => {
        if (response.ok) {
            fetchCityList();
        } else {
            alert('Error adding city');
        }
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
                fetchCityList();
            } else {
                alert('Error deleting city');
            }
        })
        .catch(error => console.error('Error deleting city:', error));
    }
}

// Initialize login form
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});

// Initialize Add City button
document.getElementById('addCityBtn').addEventListener('click', function() {
    const cityName = prompt('Enter the name of the city:');
    if (cityName) {
        addCity(cityName);
    }
});
