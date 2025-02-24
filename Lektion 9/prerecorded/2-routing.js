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
	systemInstruction:
		"You are a helpful AI-assistant providing good customer service experience for the user.",
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

	const userQuery =
		"I'm having trouble logging into my account, it only says 'Password not valid'";

	const routingPrompt = `
    Classify the following customer service query into one of the following categories:
    "Technical support", "Billing" or "General inquiry".
    Provide only the category name.

    Query: ${userQuery}
    `;

	const routingResult = await chatSession.sendMessage(routingPrompt);

	const category = routingResult.response.text();
	console.log("Routing result: ", category);

	let specializedPrompt = "";
	if (category.toLowerCase().includes("technical support")) {
		specializedPrompt = `You are a technical support expert. Provide a brief step-by-step troubleshooting guide for this technical issue: "${userQuery}" You are the customer support. So be kind and answer like you are answering an actual user. Provide an email "abc@joel.com" that the user can email if the problem is not solved.`;
	} else if (category.toLowerCase().includes("billing")) {
		specializedPrompt = `You are a billing specialist. Provide a detailed and empathetic response to assist with this billing query: "${userQuery}"`;
	} else {
		specializedPrompt = `Provide a clear, kind and informative response to the following inquiry: "${userQuery}"`;
	}

	const specializedResult = await chatSession.sendMessage(specializedPrompt);
	const finalResponse = specializedResult.response.text();
	console.log("Final response is: ", finalResponse);
}

run();
