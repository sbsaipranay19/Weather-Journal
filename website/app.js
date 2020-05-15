let apiKey = ',us&units=imperial&appid=46b6918e92c90c81aa81543302dc0d41';
let apiUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
document.getElementById('generate').addEventListener('click', checkWeather);

/*
*
*Takes the strings provided and than checks it from the api to get info
*/
function checkWeather(e) {
    e.preventDefault();
    const zipCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value
    if (zipCode.length == 0) {
        alert("Zip Code not entered");
        return;
    }
    if (feelings.length == 0) {
        alert("Your feelings not entered");
        return;
    }
    console.log(`Retrieving Weather for: ${zipCode}`);
    try {
        getWeatherInfo(apiUrl, zipCode, apiKey)
            .then(function (data) {
                console.log(data);
                postData('/post', {
                    temperature: data.main.temp,
                    weather: data
                        .weather[0]
                        .description,
                    date: newDate,
                    feelings: feelings
                })
            })
            .then(function () {
                updateUI()
            })
    } catch (error) {
        console.log('Error: ', error);
    }
}

/*
* Asynchronous Function takes the api url and the key provided combines with the zip code
* provided and than gets data from the api
*/
const getWeatherInfo = async (apiUrl, zip, key) => {
    const res = await fetch(apiUrl + zip + key)
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Oops, Error: ', error);
    }
}

/*
*   Asynchronoue function to catch the routes fro the server
*/
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

/*  Updating the UI adding the date,temperatue and feelingas enterned to Most Recent *  *  entries section and even to the console
  */
let xHold = 0;
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData[xHold].date);
        console.log(allData[xHold].temperature);
        console.log(allData[xHold].feelings);
        console.log(allData[xHold].sunrise);
        document.getElementById('date').innerHTML = `Date: ${allData[xHold].date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData[xHold].temperature}F`;
        document.getElementById('content').innerHTML = `Feelings: ${allData[xHold].feelings}`;
        xHold += 1;
    } catch (error) {
        console.log("Update Error", error);
    }
}