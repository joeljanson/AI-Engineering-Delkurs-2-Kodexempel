// https://ai.google.dev/gemini-api/docs/function-calling - Bra resurs
const dotenv = require("dotenv/config");
const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash-exp",
	tools: [
		{
			functionDeclarations: [
				{
					name: "getCurrentWeather",
					description:
						"gets the weather for a requested latitude and longitude",
					parameters: {
						type: "object",
						properties: {
							latitude: {
								type: "string",
							},
							longitude: {
								type: "string",
							},
						},
						required: ["latitude", "longitude"],
					},
				},
			],
		},
	],
	toolConfig: { functionCallingConfig: { mode: "AUTO" } },
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

async function run() {
	//console.log(await getCurrentWeather(52.52, 13.41));
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const result = await chatSession.sendMessage(
		"What is the weather like in stockholm?"
	);
	for (candidate of result.response.candidates) {
		console.log("Candidate is: ", candidate);
		for (part of candidate.content.parts) {
			console.log("Part is: ", part);
			if (part.functionCall) {
				const items = part.functionCall.args;
				const args = Object.keys(items)
					.map((data) => [data, items[data]])
					.map(([key, value]) => `${key}:${value}`)
					.join(", ");
				console.log(`${part.functionCall.name}(${args})`);
				if (part.functionCall.name === "getCurrentWeather") {
					const weatherData = await getCurrentWeather(
						items.latitude,
						items.longitude
					);
					console.log(weatherData);
					const resultTwo = await chatSession.sendMessage([
						{
							functionResponse: {
								name: "getCurrentWeather",
								response: weatherData,
							},
						},
					]);
					console.log(resultTwo.response);
					console.log(resultTwo.response.text());
				}
			}
		}
	}
}

async function getLocation(city) {
	const locationData = {
		latitude: 59.3274,
		longitude: 18.0653,
	};
	return locationData;
}

async function getCurrentWeather(latitude, longitude) {
	console.log(
		"Getting weather information from the weather api: ",
		latitude,
		longitude
	);
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
	const response = await fetch(url);
	const weatherData = await response.json();
	return weatherData;
}

run();
