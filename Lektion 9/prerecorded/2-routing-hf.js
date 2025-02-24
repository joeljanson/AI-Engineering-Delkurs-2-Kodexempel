const dotenv = require("dotenv/config");
const { HfInference } = require("@huggingface/inference");

const apiKey = process.env.HF_TOKEN;
const client = new HfInference(apiKey);

async function run() {
	const userQuery =
		"I'm having trouble logging in to my account, it only says password not valid";

	const routingPrompt = `
Classify the following customer service query into one of these categories: 
"Technical Support", "Billing", or "General Inquiry". 
Provide only the category name.

Query: "${userQuery}"
  `;

	const routingResponse = await client.chatCompletion({
		model: "meta-llama/Llama-3.2-3B-Instruct",
		messages: [
			{
				role: "user",
				content: routingPrompt,
			},
		],
		provider: "hf-inference",
		max_tokens: 8000,
	});

	const category = routingResponse.choices[0].message.content.trim();
	console.log("Category:", category);

	let specializedPrompt = "";
	if (category.toLowerCase().includes("billing")) {
		specializedPrompt = `You are a billing specialist. Provide a detailed and empathetic response to assist with this billing query: "${userQuery}"`;
	} else if (category.toLowerCase().includes("technical")) {
		specializedPrompt = `You are a technical support expert. Provide a brief step-by-step troubleshooting guide for this technical issue: "${userQuery}" You are the customer support. So be kind and answer like you are answering an actual user. Provide an email "abc@joel.com" that the user can email if the problem is not solved.`;
	} else {
		specializedPrompt = `Provide a clear and informative response to the following inquiry: "${userQuery}"`;
	}

	const specializedResponse = await client.chatCompletion({
		model: "meta-llama/Llama-3.2-3B-Instruct",
		messages: [
			{
				role: "user",
				content: specializedPrompt,
			},
		],
		provider: "hf-inference",
		max_tokens: 500,
		/* temperature: 0.1,
		top_p: 0.5, */
	});

	const finalResponse = specializedResponse.choices[0].message.content.trim();
	console.log("Final Response:", finalResponse);
}

run();
