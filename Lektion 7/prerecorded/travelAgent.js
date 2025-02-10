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
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "text/plain",
};

async function run(destination, interest) {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const prompt1 = `We are planning a trip to ${destination} with a focus on ${interest}. Please list the top 10 must-see attractions in ${destination}`;

	const result1 = await chatSession.sendMessage(prompt1);
	const attractionsText = result1.response.text();
	console.log("Attractions:", result1.response.text());

	const prompt2 = `Based on the attractions you just listed, please group these attractions by their location or neighborhood so that visiting them in a single day would minimize travel time`;

	const result2 = await chatSession.sendMessage(prompt2);
	const groupedAttractions = result2.response.text();
	console.log("Grouped attractions:", result2.response.text());

	const prompt3 = `Ùsing the grouped attractions, generate a detailed 3-day itinerary for ${destination}. Include the order of visits, estimated times, and suggestions for meal breaks for each day.`;
	const result3 = await chatSession.sendMessage(prompt3);
	const itinerary = result3.response.text();
	console.log("Final itinerary:", itinerary, "\n\n\n\n\n\n");
	console.log(result3.response);
}

run("Stockholm", "art, cuisine and local history");
