/*

Vi behöver en bra prompt som gör att planeringsagentent förstår vad det är vi är ute efter.
Vi vill ha structured outputs där vi har en 
projekt beskrivning, 
key features, 
htmlstruktur, 
css-struktur,
javascript struktur.
implementations guide (steg för steg tänk)

*/

const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `You are a seasoned web developer tasked with planning a web application based on the requirements provided by the user.

Please analyze these requirements and create a detailed development plan with pseudo code for HTML, CSS, and JavaScript.
Your response should be a comprehensive specification that a coding agent can follow to implement the web application.

Return your response in the following structure:
# Project Overview
[Project overview]

# Key Features
[Key features]

# HTML Structure    
[HTML structure]

# CSS Structure
[CSS structure]

# JavaScript Structure
[JavaScript structure]

# Implementations Guide - a step by step guide on how to implement the web application
[Implementations guide]

ONLY answer with the developer roadmap, no extra explanations.`;

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

async function createDeveloperRoadmap(prompt) {
    console.log("Creating developer roadmap for prompt:", prompt);



	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const originalPrompt = `Here is the prompt: "${prompt}"

Please create a developer roadmap for the web application.`;

	const result = await chatSession.sendMessage(originalPrompt);
	console.log(result.response.text());

	return result.response.text();
}

module.exports = { createDeveloperRoadmap };
