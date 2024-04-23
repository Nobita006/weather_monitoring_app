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
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('logoutForm').style.display = 'block';
            document.getElementById('loggedInUser').textContent = username;
            // Show home screen after successful login
            document.getElementById('homeScreen').style.display = 'block';
            // Fetch city list
            fetchCityList();
        } else {
            alert('Invalid username or password');
        }
    })
    .catch(error => console.error('Error logging in:', error));
}

// Function to handle user logout
function logout() {
    fetch('http://127.0.0.1:5000/logout')
    .then(response => {
        if (response.ok) {
            // Show login form after logout
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('logoutForm').style.display = 'none';
            // Hide home screen after logout
            document.getElementById('homeScreen').style.display = 'none';
        } else {
            alert('Error logging out');
        }
    })
    .catch(error => console.error('Error logging out:', error));
}

// Function to handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Perform authentication (to be implemented)
    // If authentication succeeds, show home screen
    toggleScreen('homeScreen');
    // Fetch city list
    fetchCityList();
});

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
    fetch('http://127.0.0.1:5000/cities') // Update the URL to match your backend URL
        .then(response => response.json())
        .then(data => {
            const cityListDiv = document.getElementById('cityList');
            cityListDiv.innerHTML = ''; // Clear previous content

            // Loop through each city and create HTML elements to display them
            data.forEach(city => {
                const cityDiv = document.createElement('div');
                cityDiv.innerHTML = `<p>${city.name}</p>
                                     <p>Temperature: ${city.temperature}</p>
                                     <p>Humidity: ${city.humidity}</p>
                                     <button onclick="deleteCity('${city.name}')">Delete</button>`;
                cityListDiv.appendChild(cityDiv);
            });
        })
        .catch(error => console.error('Error fetching city list:', error));
}

// Function to handle "Add City" button click
document.getElementById('addCityBtn').addEventListener('click', function() {
    const cityName = prompt('Enter the name of the city:');
    if (cityName) {
        // Call the function to add the city
        addCity(cityName);
    }
});

// Function to add a city
function addCity(cityName) {
    fetch(`http://127.0.0.1:5000/cities/add/${cityName}`)
        .then(response => {
            if (response.ok) {
                // City added successfully, refresh the city list
                fetchCityList();
            } else {
                alert('Error adding city');
            }
        })
        .catch(error => console.error('Error adding city:', error));
}

// Function to handle city delete button click
function deleteCity(cityName) {
    if (confirm(`Are you sure you want to delete ${cityName}?`)) {
        fetch(`http://127.0.0.1:5000/cities/delete/${cityName}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // City deleted successfully, refresh the city list
                fetchCityList();
            } else {
                alert('Error deleting city');
            }
        })
        .catch(error => console.error('Error deleting city:', error));
    }
}

// Function to handle city click and show details
document.getElementById('cityList').addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'DIV') {
        const cityName = event.target.textContent;
        // Show city details (to be implemented)
        // For now, let's just alert
        alert(`City ${cityName} clicked`);
    }
});
