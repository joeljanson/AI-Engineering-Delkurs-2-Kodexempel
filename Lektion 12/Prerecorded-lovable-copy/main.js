

const { validateRequest } = require('./agents/requestValidation');
const { refineRequest } = require('./agents/requestRefinement');
const { createDeveloperRoadmap } = require('./agents/requestPlanning');
const { generateCode, updateCodeWithFeedback } = require('./agents/requestCoding');
const { provideFeedback } = require('./agents/requestFeedback');

const fs = require('fs');
const path = require('path');

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

	console.log("Refined prompt:", refinementResult);

	//3. Skicka in den förfinade prompten till en agent som skapar en plan för hur man ska bygga webbapplikationen.
	// Den här planen ska inkludera pseudokod för html, css och javascript.
	// planningAgent - requestPlanning.js

	const developerRoadmap = await createDeveloperRoadmap(refinementResult);

	console.log("Developer roadmap:", developerRoadmap);

	//4. Skicka in den förfinade planen till en agent som sedan skapar koden.
	// codingAgent - requestCoding.js

	const codingResult = await generateCode(developerRoadmap);

	console.log("Generated code:", codingResult.htmlCode, codingResult.cssCode, codingResult.javascriptCode);   

	//5. Skicka in koden till en agent som utvärderar koden och ger feedback
	// feedbackAgent - requestFeedback.js

	/*const feedbackResult = await provideFeedback(codingResult.code);

	console.log("Feedback:", feedbackResult);*/

	//6. Skicka in feedbacken till samma agent som sedan förfinar koden.
	// codingAgent - requestCoding.js

	//const finalResult = await updateCodeWithFeedback(feedbackResult.feedback);

	//console.log("Final code:", finalResult);

	//7. Anropa en funktion i main.js som sparar koden till en mapp som heter "code" funktion ska ta emot css-kod, html-kod och javascript-kod.
	// Spara respektive kod till en html-fil, css-fil och javascript-fil. Allt detta sker i main.js

	saveCode(codingResult, validationResult.title);
}

async function saveCode(code, title) {
	console.log("Final code is written, save to disk:", code);

    const dirName = `${title}-${Date.now()}`;

    const outputDir = path.join(process.cwd(), dirName);
    if (!fs.existsSync(outputDir)) {
        try {   
            await fs.mkdirSync(outputDir, { recursive: true });
            console.log("Output directory created:", outputDir);
        } catch (error) {
            console.error("Error creating output directory:", error);
            return;
        }
    }

	await fs.writeFileSync(path.join(outputDir, 'index.html'), code.htmlCode);
	await fs.writeFileSync(path.join(outputDir, 'style.css'), code.cssCode);
	await fs.writeFileSync(path.join(outputDir, 'script.js'), code.javascriptCode);

	console.log("Code saved to disk:", outputDir);
}

processUserPrompt("Could you create an web application that is a blog? I want the user to be able to write posts and read posts. As well as change the color of the background and the font color.");
