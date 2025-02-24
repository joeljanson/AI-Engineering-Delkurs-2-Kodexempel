const dotenv = require("dotenv/config");
const { HfInference } = require("@huggingface/inference");

const apiKey = process.env.HF_TOKEN;
const client = new HfInference(apiKey);

async function codeAgent(prompt) {
	const codePrompt =
		prompt + "\n\nONLY RETURN THE CODE, NO EXPLANATIONS OR ANYTHING ELSE.";

	const codeGeneration = await client.chatCompletion({
		model: "meta-llama/Llama-3.2-3B-Instruct",
		messages: [
			{
				role: "user",
				content: codePrompt,
			},
		],
		provider: "hf-inference",
		max_tokens: 500,
	});

	const generatedCode = codeGeneration.choices[0].message.content;
	console.log("Generated Code:\n", generatedCode);
	evaluator(generatedCode);
}

async function evaluator(generatedCode) {
	const evaluationPrompt = `
You are an expert software engineer. Please review the following JavaScript code for correctness, efficiency, and readability.
Do not write any code yourself, only give feedback.

Code:
${generatedCode}

Provide your feedback as a list of bullet points.

If the code needs to be corrected, include the following in your response: <NEEDS CORRECTION>
If it is correct and can be used, include the following in your response: <GOOD CODE>
  `;

	const codeEvaluation = await client.chatCompletion({
		model: "meta-llama/Llama-3.2-3B-Instruct",
		messages: [
			{
				role: "user",
				content: evaluationPrompt,
			},
		],
		provider: "hf-inference",
		max_tokens: 500,
	});

	const evaluationFeedback = codeEvaluation.choices[0].message.content;
	console.log("\nEvaluation Feedback:\n", evaluationFeedback);
	const needsCorrection = evaluationFeedback.trim();
	console.log("Category:", needsCorrection);

	if (needsCorrection.toLowerCase().includes("needs correction")) {
		const newPrompt = `Great, the javascript ${generatedCode} function looks good, however I have a few suggestions, could you implement the following changes?${evaluationFeedback}`;
		codeAgent(newPrompt);
	} else {
		console.log("CODE IS GOOD!");
	}
}

const codePrompt = `
Write a JavaScript function named "reverseString" that takes a string as input and returns the string reversed.
  `;

codeAgent(codePrompt);
