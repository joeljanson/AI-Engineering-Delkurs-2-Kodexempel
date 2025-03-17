

const { validateRequest } = require('./agents/requestValidation');
const { refineRequest } = require('./agents/requestRefinement');
const { createDeveloperRoadmap } = require('./agents/requestPlanning');
const { generateCode, updateCodeWithFeedback } = require('./agents/requestCoding');
const { provideFeedback } = require('./agents/requestFeedback');

// Använd användarens prompt för att skicka in i en funktion som sätter igång hela agentiska systemet.
async function processUserPrompt(prompt) {
	//1. Skicka in en prompt som kan vara vad som helst. Första steget är att validera att denna prompt är en förfrågan om att bygga en webbapplikation.
	// validationAgent - requestValidation.js

	const validationResult = await validateRequest(prompt);

	if (!validationResult.isValid) {
		console.log(validationResult.message);
		return;
	}

	//2. Skicka prompten till en agent som förfinar prompten. Och förtydligar vad agenten tror att användaren egentligen vill ha.
	// refinementAgent - requestRefinement.js

	const refinementResult = await refineRequest(prompt);

	console.log(refinementResult);

	//3. Skicka in den förfinade prompten till en agent som skapar en plan för hur man ska bygga webbapplikationen.
	// Den här planen ska inkludera pseudokod för html, css och javascript.
	// planningAgent - requestPlanning.js

	const planningResult = await createDeveloperRoadmap(refinementResult.refinedPrompt);

	console.log(planningResult);

	//4. Skicka in den förfinade planen till en agent som sedan skapar koden.
	// codingAgent - requestCoding.js

	const codingResult = await generateCode(planningResult.plan);

	console.log(codingResult);

	//5. Skicka in koden till en agent som utvärderar koden och ger feedback
	// feedbackAgent - requestFeedback.js

	const feedbackResult = await provideFeedback(codingResult.code);

	console.log(feedbackResult);

	//6. Skicka in feedbacken till samma agent som sedan förfinar koden.
	// codingAgent - requestCoding.js

	const finalResult = await updateCodeWithFeedback(feedbackResult.feedback);

	console.log(finalResult);

	//7. Anropa en funktion i main.js som sparar koden till en mapp som heter "code" funktion ska ta emot css-kod, html-kod och javascript-kod.
	// Spara respektive kod till en html-fil, css-fil och javascript-fil. Allt detta sker i main.js

	saveCode(finalResult.code);
}

async function saveCode(code) {
	console.log("Final code is written, save to disk:", code);
}

processUserPrompt("Could you create an web application that plays a sound using Tone.js when I click a button?");

