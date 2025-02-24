// Coordinates for Stockholm
const latitude = 59.3293;
const longitude = 18.0686;

// SMHI API endpoint for point forecasts
const url = `https://opendata.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;

async function getWeatherForecast() {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();

		// Extracting some key information
		const timeSeries = data.timeSeries.slice(0, 5); // Get the first 5 forecasted time points

		console.log("Stockholm Weather Forecast:");
		timeSeries.forEach((entry) => {
			console.log(`Time: ${entry.validTime}`);
			entry.parameters.forEach((param) => {
				if (param.name === "t") {
					// "t" is temperature in Celsius
					console.log(`Temperature: ${param.values[0]}°C`);
				}
				if (param.name === "ws") {
					// "ws" is wind speed in m/s
					console.log(`Wind Speed: ${param.values[0]} m/s`);
				}
			});
			console.log("-------------");
		});
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

// Run the function
getWeatherForecast();
