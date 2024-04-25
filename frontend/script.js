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
            return response.json(); // Return the response data
        } else {
            throw new Error('Invalid username or password');
        }
    })
    .then(data => {
        // Update UI and store login state in local storage
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('homeScreen').style.display = 'block';
        document.getElementById('loggedInUser').textContent = username;
        document.getElementById('loggedInUserHeader').textContent = `Logged in as ${username}`;
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('username', username);
        fetchCityList(); // Fetch city list after successful login
    })
    .catch(error => {
        document.getElementById('loginError').textContent = error.message;
        document.getElementById('loginError').classList.remove('hidden');
    });
}

// Function to handle user logout
function logout() {
    fetch('http://127.0.0.1:5000/logout')
    .then(response => {
        if (response.ok) {
            // Update UI and clear login state from local storage
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('homeScreen').style.display = 'none';
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
        } else {
            throw new Error('Error logging out');
        }
    })
    .catch(error => alert(error.message));
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
                cityDiv.innerHTML = `<p class="cityName">${capitalizeFirstLetter(city.name)}</p>
                                     <p>Temperature: ${city.temperature}°C ${getTemperatureIcon(city.temperature)}</p>
                                     <p>Humidity: ${city.humidity}%</p>
                                     <button class="deleteBtn" onclick="deleteCity('${city.name}')">Delete</button>`;

                // Attach onclick event to the whole city division
                cityDiv.onclick = function() {
                    showCityDetails(city.name);
                };
                
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
            return response.json().then(data => {
                throw new Error(data.error); // Throw an error with the error message from the response
            });
        }
    })
    .then(data => {
        fetchCityList(); // Fetch city list after successfully adding the city
    })
    .catch(error => {
        alert(error.message); // Display the error message to the user
    });
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
        // Update UI and fetch city list if user is logged in
        document.getElementById('loggedInUser').textContent = username;
        document.getElementById('loggedInUserHeader').textContent = `Logged in as ${username}`;
        fetchCityList();
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('homeScreen').style.display = 'block';
    } else {
        // Show login form if user is not logged in
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('homeScreen').style.display = 'none';
    }
});

// Initialize Add City button
document.getElementById('addCityBtn').addEventListener('click', () => {
    const cityName = prompt('Enter the name of the city:');
    if (cityName) {
        addCity(cityName);
    }
});

// Function to show city details popup
function showCityDetails(cityName) {
    fetch(`http://127.0.0.1:5000/cities/${cityName}`)
        .then(response => response.json())
        .then(data => {
            const cityNameElem = document.getElementById('cityName');
            const cityTemperatureElem = document.getElementById('cityTemperature');
            const cityHumidityElem = document.getElementById('cityHumidity');

            cityNameElem.textContent = data.name;
            cityTemperatureElem.textContent = data.temperature;
            cityHumidityElem.textContent = data.humidity;

            // Fetch historical data for the selected city
            fetch(`http://127.0.0.1:5000/cities/${cityName}/history`)
                .then(response => response.json())
                .then(history => {
                    // Extract timestamps, temperatures, and humidities from historical data
                    const timestamps = history.map(entry => new Date(entry.timestamp).toLocaleString());
                    const temperatures = history.map(entry => entry.temperature);
                    const humidities = history.map(entry => entry.humidity);

                    // Create temperature chart
                    const temperatureChart = document.getElementById('temperatureChart');
                    new Chart(temperatureChart, {
                        type: 'line',
                        data: {
                            labels: timestamps,
                            datasets: [{
                                label: 'Temperature (°C)',
                                data: temperatures,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }],
                                xAxes: [{
                                    ticks:{
                                        display: false // Hides only the labels of the x-axis 
                                    }  
                                }]
                            }
                        }
                    });

                    // Create humidity chart
                    const humidityChart = document.getElementById('humidityChart');
                    new Chart(humidityChart, {
                        type: 'line',
                        data: {
                            labels: timestamps,
                            datasets: [{
                                label: 'Humidity (%)',
                                data: humidities,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }],
                                xAxes: [{
                                    ticks:{
                                        display: false // Hides only the labels of the x-axis 
                                    }  
                                }]
                            }
                        }
                    });
                })
                .catch(error => console.error('Error fetching historical data:', error));

            // Show popup
            document.getElementById('cityDetailsPopup').classList.remove('hidden');
        })
        .catch(error => console.error('Error fetching city details:', error));
}

// Function to hide popup
function hidePopUp() {
    document.getElementById('cityDetailsPopup').classList.add('hidden');
}
