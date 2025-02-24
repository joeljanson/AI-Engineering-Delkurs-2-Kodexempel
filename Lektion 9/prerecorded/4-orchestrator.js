const dotenv = require("dotenv/config");
const {
	GoogleGenerativeAI,
	SchemaType,
	HarmCategory,
	HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash-exp",
});

const taskSchema = {
	description: "Breakdown of a coding task into specific sub-tasks.",
	type: SchemaType.ARRAY,
	items: {
		type: SchemaType.OBJECT,
		properties: {
			taskName: { type: SchemaType.STRING, description: "Name of the task" },
			description: { type: SchemaType.STRING, description: "Task details" },
		},
		required: ["taskName", "description"],
	},
};

const codeSchema = {
	description: "Generated code for a specific task.",
	type: SchemaType.OBJECT,
	properties: {
		taskName: { type: SchemaType.STRING, description: "Task name" },
		code: { type: SchemaType.STRING, description: "Generated code snippet" },
	},
	required: ["taskName", "code"],
};

const finalProjectSchema = {
	description: "Final structured web application components",
	type: SchemaType.OBJECT,
	properties: {
		html: { type: SchemaType.STRING, description: "Final HTML content" },
		css: { type: SchemaType.STRING, description: "Final CSS styles" },
		js: { type: SchemaType.STRING, description: "Final JavaScript logic" },
	},
	required: ["html", "css", "js"],
};

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "application/json",
};

async function orchestrateTask(mainTask) {
	const orchestratorSession = model.startChat({
		generationConfig: { ...generationConfig, responseSchema: taskSchema },
		history: [],
	});

	const orchestratorPrompt = `
    You are an expert software orchestrator.
    Your job is to break down the task "${mainTask}" into its essential coding components.
    For each component, provide:
    - "taskName": A short, descriptive name (e.g., "HTML Structure", "CSS Styling", "JavaScript Logic").
    - "description": A detailed explanation of what needs to be done for that part of the project.

    Return a structured JSON array.
    `;

	console.log(orchestratorPrompt);

	const orchestratorResponse = await orchestratorSession.sendMessage(
		orchestratorPrompt
	);
	const taskBreakdown = JSON.parse(orchestratorResponse.response.text());
	console.log("Task breakdown: \n");
	console.log(taskBreakdown);
	return taskBreakdown;
}

async function generateCode(task) {
	const agentSession = model.startChat({
		generationConfig: { ...generationConfig, responseSchema: codeSchema },
		history: [],
	});

	const agentPrompt = `
You are an expert software engineer.
Your task is to implement the following:

Task Name: ${task.taskName}
Description: ${task.description}

Please return only the structured JSON output with the code.
`;

	const response = await agentSession.sendMessage(agentPrompt);
	return JSON.parse(response.response.text());
}

async function assembleProject(codeSnippets) {
	const assemblySession = model.startChat({
		generationConfig: {
			...generationConfig,
			responseSchema: finalProjectSchema,
		},
		history: [],
	});

	let assemblyPrompt = `
You are an expert orchestrator assembling a web application.
Below are the generated components:

`;

	codeSnippets.forEach(({ taskName, code }) => {
		assemblyPrompt += `${taskName} Code:\n\`\`\`${taskName.toLowerCase()}\n${code}\n\`\`\`\n\n`;
	});

	assemblyPrompt += `
Ensure:
- The HTML, CSS, and JavaScript are properly connected.
- The project runs without syntax errors.
- The final output includes separate sections for HTML, CSS, and JavaScript.
- The final HTML is complete with a <head>, <body>, <script> and <link> tags.

Return a structured JSON object with the keys:
- "html": Containing the final HTML content.
- "css": Containing the final CSS content.
- "js": Containing the final JavaScript content.
`;

	const finalResponse = await assemblySession.sendMessage(assemblyPrompt);
	return JSON.parse(finalResponse.response.text().trim());
}

async function run() {
	const mainTask =
		"Build a simple keyboard instrument using Tone.js for the web";

	const taskBreakdown = await orchestrateTask(mainTask);

	const codeGenerationPromises = taskBreakdown.map(generateCode);
	const generatedCodeSnippets = await Promise.all(codeGenerationPromises);

	console.log("\n Generated code snippets:");
	generatedCodeSnippets.forEach(({ taskName, code }) => {
		console.log(`\n${taskName} code: ${code}`);
	});

	const finalProject = await assembleProject(generatedCodeSnippets);
	console.log("\n final web application:");
	console.log(finalProject);

	console.log("\nFinal HTML:\n", finalProject.html);
	console.log("\nFinal CSS:\n", finalProject.css);
	console.log("\nFinal JavaScript:\n", finalProject.js);
}

run();
