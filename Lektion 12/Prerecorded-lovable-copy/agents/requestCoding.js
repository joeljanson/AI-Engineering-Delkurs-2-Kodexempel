/*

Vår kodagent skulle behöva kunna returnera en structured output som har html, css och javascript kod.
Vi behöver en bra prompt som gör att kodagenten returnerar bra kod och ser till att följa ett visst designmönster.

*/

const {
	GoogleGenerativeAI,
	HarmCategory,
	HarmBlockThreshold,
	SchemaType,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
});

const codeSchema = {
	type: SchemaType.OBJECT,
	properties: {
		htmlCode: {
			type: SchemaType.STRING,
			description: "The complete HTML code for the web application",
		},
		cssCode: {
			type: SchemaType.STRING,
			description: "The complete CSS code for the web application",
		},
		javascriptCode: {
			type: SchemaType.STRING,
			description: "The complete JavaScript code for the web application",
		},
	},
	required: ["htmlCode", "cssCode", "javascriptCode"],
};

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "application/json",
	responseSchema: codeSchema,
};

async function generateCode(plan) {
	console.log("Generating code for plan:", plan);

	try {
		const chatSession = model.startChat({
			generationConfig,
			history: [],
		});

		const prompt = `You are an experienced web developer. Your task is to implement a web application based on the following development plan:

        Generate the HTML, CSS and JavaScript code for the web application based on the following plan: ${plan}
        
        Please generate complete, functional, and well-formatted HTML, CSS, and JavaScript code for this web application. 
        The code should be ready to run in a browser without additional dependencies unless specified in the plan.
        Ensure the code is clean, commented where appropriate, and follows best practices.

        Pay special attention to the css design. Use flexbox to align items well. Always think minimalistic design unless otherwise specified. Be generous with padding and margin.
        Chose mostly black and white colors and one or two accent colors.

        The script and css link tags should be in the head tag of the html file. And MUST be named script.js and style.css in the html file.

        `;

		const result = await chatSession.sendMessage(prompt);

        const codeOutput = JSON.parse(result.response.text());
        console.log("Code generated:", codeOutput);

		return codeOutput;
	} catch (error) {
		console.error("Error generating code:", error);
		throw error;
	}
}

async function updateCodeWithFeedback(feedback) {
	return {
		code: "The code is good, but it could be improved.",
	};
}

module.exports = { generateCode, updateCodeWithFeedback };
