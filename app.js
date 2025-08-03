// 🌤️ Set dynamic weather-based background
function setWeatherBackground(weatherType) {
    const body = document.body;
    const backgrounds = {
        Clear: 'url("https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80")',
        Clouds: 'url("https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=80")',
        Rain: 'url("https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80")',
        Snow: 'url("https://images.unsplash.com/photo-1608889175442-ea1d08e1c5ae?auto=format&fit=crop&w=1600&q=80")',
        Thunderstorm: 'url("https://images.unsplash.com/photo-1607349688749-1bd3a4283673?auto=format&fit=crop&w=1600&q=80")',
        Drizzle: 'url("https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80")',
        Mist: 'url("https://images.unsplash.com/photo-1526481280690-9f6c2b5b6b57?auto=format&fit=crop&w=1600&q=80")',
        Haze: 'url("https://images.unsplash.com/photo-1549887534-25f87c8e7f31?auto=format&fit=crop&w=1600&q=80")'
    };

    const selectedBg = backgrounds[weatherType] || backgrounds['Clear'];
    body.style.transition = 'background-image 0.6s ease-in-out';
    body.style.backgroundImage = selectedBg;
}


// 📊 Weather chart setup
let weatherChart;

document.getElementById('getWeatherBtn').addEventListener('click', function () {
    const city = document.getElementById('city').value.trim();
    const apiKey = '61b6c230b769c72918fa07029402f581';

    if (!city) {
        document.getElementById('errorMessage').innerText = 'Please enter a city name.';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    document.getElementById('errorMessage').innerText = '';
    document.getElementById('weatherDetails').style.display = 'none';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weatherType = data.weather[0].main;
            setWeatherBackground(weatherType);

            // UI Update
            document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
            document.getElementById('weatherDesc').innerText = `Condition: ${capitalize(data.weather[0].description)}`;
            document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
            document.getElementById('windSpeed').innerText = `Wind Speed: ${data.wind.speed} m/s`;

            const iconCode = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            document.getElementById('weatherDetails').style.display = 'block';

            // Chart Data
            const chartData = {
                labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
                datasets: [{
                    label: 'Current Weather',
                    data: [data.main.temp, data.main.humidity, data.wind.speed],
                    backgroundColor: [
                        'rgba(255, 193, 7, 0.7)',   // Temp
                        'rgba(33, 150, 243, 0.7)',  // Humidity
                        'rgba(76, 175, 80, 0.7)'    // Wind
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    borderRadius: 6,
                    hoverBackgroundColor: [
                        'rgba(255, 193, 7, 1)',
                        'rgba(33, 150, 243, 1)',
                        'rgba(76, 175, 80, 1)'
                    ]
                }]
            };

            const ctx = document.getElementById('weatherChart').getContext('2d');

            if (weatherChart) {
                weatherChart.data = chartData;
                weatherChart.update();
            } else {
                weatherChart = new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color: '#ffffff',
                                    font: { size: 14 }
                                }
                            },
                            tooltip: {
                                backgroundColor: '#333',
                                titleColor: '#fff',
                                bodyColor: '#fff'
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '#ffffff',
                                    font: { size: 13 }
                                },
                                grid: { color: '#555' }
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: '#ffffff',
                                    font: { size: 13 }
                                },
                                grid: { color: '#555' }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => {
            document.getElementById('errorMessage').innerText = 'City not found. Please try again.';
        });
});


// 🔠 Capitalize first letter helper
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

