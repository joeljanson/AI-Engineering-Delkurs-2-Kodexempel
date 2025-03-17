/*

Vi behöver en prompt som gör att förfiningsagenten förstår vad det är vi är ute efter.

*/

const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `You are a prompt engineering expert who refines web application development prompts.
Your task is to take the user's original prompt about creating a web application and enhance it by:
1. Maintaining all the original requirements and functionality
2. Considering UI/UX aspects that might have been omitted
3. Organizing the prompt in a clear structure
4. Implement simple but useful features that could easily be implemented. However never add any pages, it's a single page application.
You should NOT completely change the nature of the requested application. It's an application that should be built using HTML, CSS and vanilla Javascript.

ONLY answer with the refined prompt, no extra explanations.`;


const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash-thinking-exp-01-21",
	systemInstruction: systemInstruction,
});

const generationConfig = {
	temperature: 0.7,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 65536,
	responseMimeType: "text/plain",
};

async function refineRequest(prompt) {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const originalPrompt = `Here is the original prompt: "${prompt}"

Please refine this prompt to make it more detailed and comprehensive, while keeping all the original requirements.`;

	const result = await chatSession.sendMessage(originalPrompt);
	console.log(result.response.text());

	return result.response.text();
}

module.exports = { refineRequest };
