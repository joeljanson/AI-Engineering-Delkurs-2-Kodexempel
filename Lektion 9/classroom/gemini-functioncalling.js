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
				{
					name: "getLocation",
					description: "gets the latitude and longitude for a requested city",
					parameters: {
						type: "object",
						properties: {
							city: {
								type: "string",
								description: "the name of the city",
							},
						},
						required: ["city"],
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
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	let message = "What is the weather like in los angeles?";
	let response = await chatSession.sendMessage(message);
	//console.log(response.response.text());

	while (true) {
		let functionCalled = false;
		for (const candidate of response.response.candidates) {
			for (const part of candidate.content.parts) {
				if (part.functionCall) {
					functionCalled = true;
					const functionName = part.functionCall.name;

					const args = part.functionCall.args;

					let functionResult;
					if (functionName === "getLocation") {
						functionResult = await getLocation(args.city);
					} else if (functionName === "getCurrentWeather") {
						functionResult = await getCurrentWeather(
							args.latitude,
							args.longitude
						);
					}
					console.log(
						`Called ${functionName} with args ${JSON.stringify(args)}.`
					);
					console.log(`Function result:`, functionResult);

					const combinedResponse = {
						weatherData: functionResult,
						currentTime: new Date().toISOString(),
					};
					response = await chatSession.sendMessage([
						{
							functionResponse: {
								name: functionName,
								response: combinedResponse,
							},
						},
					]);
					break;
				}
			}
			if (functionCalled) break;
		}
		if (!functionCalled) {
			console.log("Final response:", response.response.text());
			break;
		}
	}
}

async function getLocation(city) {
	const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
		city
	)}&format=json`;
	const response = await fetch(url);
	const data = await response.json();

	if (data.length > 0) {
		return {
			latitude: data[0].lat,
			longitude: data[0].lon,
		};
	} else {
		throw new Error("City not found");
	}
}

async function getCurrentWeather(latitude, longitude) {
	console.log("Fetching weather data for:", latitude, longitude);
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
	const response = await fetch(url);
	const weatherData = await response.json();
	return weatherData;
}

run();
