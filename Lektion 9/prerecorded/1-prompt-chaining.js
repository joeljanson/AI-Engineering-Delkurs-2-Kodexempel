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

async function run() {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const prompt1 =
		"Could you generate a creative marketing copy for our new eco-friendly water bottle called 'Joels waterbottle'. I want to reach a young trendy audience. The brand is very playful but minimalistic. The waterbottle is unique because it keeps everything really cold. Return only one option, and return only text that could be used as a blog plost.";
	const result1 = await chatSession.sendMessage(prompt1);
	const marketingCopyEnglish = result1.response.text().trim();
	console.log("Marketing copy english: ", marketingCopyEnglish);
	// Ofcourse! I can help you with that....
	const prompt2 = `Translate the following marketing copy into Swedish: ${marketingCopyEnglish}`;
	const result2 = await chatSession.sendMessage(prompt2);
	const marketingCopySwedish = result2.response.text().trim();
	console.log("Marketing copy swedish: ", marketingCopySwedish);
}

run();
