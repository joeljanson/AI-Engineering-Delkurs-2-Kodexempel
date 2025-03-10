//https://ai.google.dev/gemini-api/docs/structured-output?lang=node <- resurs
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

const schema = {
	description: "List of recipes",
	type: SchemaType.ARRAY,
	items: {
		type: SchemaType.OBJECT,
		properties: {
			recipeName: {
				type: SchemaType.STRING,
				description: "Name of the recipe",
				nullable: false,
			},
			recipeDescription: {
				type: SchemaType.STRING,
				description: "A description of what the recipe is",
				nullable: false,
			},
			recipeSteps: {
				type: SchemaType.OBJECT,
				description: "A three step guide for cooking the recipe",
				properties: {
					step1: { type: SchemaType.STRING, description: "The first step" },
					step2: { type: SchemaType.STRING, description: "The second step" },
					step3: { type: SchemaType.STRING, description: "The thrid step" },
				},
				required: ["step1", "step2", "step3"],
			},
			validRequest: {
				type: SchemaType.BOOLEAN,
				description:
					"If the users request is not about recipes return false, else return true.",
				nullable: false,
			},
		},
		required: [
			"recipeName",
			"recipeDescription",
			"validRequest",
			"recipeSteps",
		],
	},
};

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "application/json",
	responseSchema: schema,
};

async function run() {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const result = await chatSession.sendMessage(
		"Could you list some popular soups?"
	);
	console.log(result.response.text());
}

run();
