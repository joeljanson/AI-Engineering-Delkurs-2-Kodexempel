const dotenv = require("dotenv/config");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

const model = "google/gemma-2-9b-it"; //"deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"

async function agentOne() {
	let out = "";

	const stream = client.chatCompletionStream({
		model: model,
		messages: [
			{
				role: "user",
				content:
					"Write a catchy slogan for coffe. Return only one single sentence.",
			},
		],
		temperature: 0.5,
		max_tokens: 2048,
		top_p: 0.7,
	});

	for await (const chunk of stream) {
		if (chunk.choices && chunk.choices.length > 0) {
			const newContent = chunk.choices[0].delta.content;
			out += newContent;
		}
	}
	return out;
}

async function agentTwo(resultAgentOne) {
	let out = "";

	const stream = client.chatCompletionStream({
		model: model,
		messages: [
			{
				role: "user",
				content: `Your role is to critique this slogan that has been created for coffee. How could it be improved? The slogan is: ${resultAgentOne}`,
			},
		],
		temperature: 0.5,
		max_tokens: 2048,
		top_p: 0.7,
	});

	for await (const chunk of stream) {
		if (chunk.choices && chunk.choices.length > 0) {
			const newContent = chunk.choices[0].delta.content;
			out += newContent;
		}
	}
	return out;
}

(async () => {
	const resultAgentOne = await feedbackAgent(
		"Could you write some code to create a step sequencer using tone.js. Respond ONLY with the code as a complete index.html."
	);
	console.log(`Result from agent one is ${resultAgentOne}`);
	const resultAgentTwo = await feedbackAgent(
		`You are an expert coder and has worked a lot with the audio web library Tone.js. Could you improve the code provided, it should be an example of a step sequencer using tone.js. The code: ${resultAgentOne}. Respond ONLY with the improved code.`
	);
	console.log(`Result from agent two is ${resultAgentTwo}`);
	const resultAgentThree = await feedbackAgent(
		`You are a code reviewer. Look through this code and see if you can find any flaws or make recommendations on how it could be improved: ${resultAgentOne}, the code is the following: ${resultAgentTwo}`
	);
	console.log(`Result from agent three is ${resultAgentThree}`);
})();

async function feedbackAgent(prompt) {
	let out = "";

	const stream = client.chatCompletionStream({
		model: model,
		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 0.5,
		max_tokens: 2048,
		top_p: 0.7,
	});

	for await (const chunk of stream) {
		if (chunk.choices && chunk.choices.length > 0) {
			const newContent = chunk.choices[0].delta.content;
			out += newContent;
		}
	}
	return out;
}
