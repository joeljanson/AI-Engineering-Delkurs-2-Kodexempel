// Stockholm's coordinates
const latitude = 59.3293;
const longitude = 18.0686;

// SMHI API endpoint for point forecasts
const apiUrl = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;

// Function to fetch weather data
async function getWeather() {
	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();

		// Process and display the data
		data.timeSeries.forEach((timePoint) => {
			const validTime = timePoint.validTime;
			const temperature = timePoint.parameters.find(
				(param) => param.name === "t"
			).values[0];
			console.log(`At ${validTime}, the temperature will be ${temperature}°C.`);
		});
	} catch (error) {
		console.error(`Error fetching weather data: ${error.message}`);
	}
}

// Call the function
getWeather();
