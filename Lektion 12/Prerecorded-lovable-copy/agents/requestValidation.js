// Exportera en funktion som jag kan anropa från main.js. Denna funktion ska kolla om prompten är en förfrågan om att bygga en webbapplikation.
// Returnera en structured output som har en boolean och ett message.

const dotenv = require("dotenv");
dotenv.config();

const { InferenceClient } = require("@huggingface/inference");
const client = new InferenceClient(process.env.HF_TOKEN);
console.log(client);

const schema = {
	type: "object",
	properties: {
		isValid: {
			type: "boolean",
			description: "Whether the request is about building a web application.",
		},
		message: {
			type: "string",
			description:
				"A kind response that tells the user 'Yes, I can help you with that!' if the request is about building a web application. And politely declines if it's not.",
		},
		title: {
			type: "string",
			description:
				"A very brief title that says something about what the web application is about.",
		},
	},
	required: ["isValid", "message", "title"],
};

async function validateRequest(prompt) {
	console.log(
		"Validating request to see if it's about building a web application:",
		prompt
	);

	const messages = [
		{
			role: "system",
			content: `You are a helpful assistant that determines if a user request is about creating a web application.
If the request is about creating a web application, respond positively and set isValid to true.
If it's not about creating a web application, politely explain that you can only help with web applications and set isValid to false.
Always respond in a friendly, helpful tone. But never ask the user to provide more information.`,
		},
		{ role: "user", content: prompt },
	];

    try {
        const result = await client.chatCompletion({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: messages,
            response_format: {type: "json", value: JSON.stringify(schema)},
            temperature: 0.3,
            max_tokens: 500,
        })

        const response = JSON.parse(result.choices[0].message.content);
        console.log("Response from validation agent:", response);

        return response;
    } catch (error) {
        console.error("Error validating request:", error);
        throw error;
    }

}

module.exports = { validateRequest };
