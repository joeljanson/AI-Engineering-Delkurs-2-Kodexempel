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

	const codeSnippet = `
    function processUserInput(input) {
        return eval(input)
    }
    `;

	const vulnerabilityPrompt = `Please review the following Javascript code for potential security vulnerablities. 
    If you identify a vulnerability, list it with a brief explanation as well as end your response with the word vulnerable in capital letters between <> like so: <VULNERABLE>
    otherwise, respond with "No vulnerabilities found"

    Codesnippet: ${codeSnippet}
    `;

	const numVotes = 3;
	const vulnerabilityChecks = [];
	for (let i = 0; i < numVotes; i++) {
		vulnerabilityChecks.push(checkVulnerability(vulnerabilityPrompt));
	}

	const responses = await Promise.all(vulnerabilityChecks);
	const assesments = responses.map((res) => res.response.text().trim());

	let vulnerableCount = 0;
	assesments.forEach((assesment, index) => {
		console.log(`Assesment ${index + 1}: ${assesment}`);
		if (assesment.includes("<VULNERABLE>")) {
			vulnerableCount++;
		}
	});

	console.log(`Vulnerability count: ${vulnerableCount}`);

	if (vulnerableCount > numVotes / 2) {
		console.log("Final verdict: The code is not safe!");
	} else {
		console.log("Final verdict: The code is safe!");
	}
}

async function checkVulnerability(vulnerabilityPrompt) {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const response = await chatSession.sendMessage(vulnerabilityPrompt);
	return response;
}

run();
