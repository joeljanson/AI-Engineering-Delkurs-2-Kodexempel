const dotenv = require("dotenv/config");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

const model = "google/gemma-2-9b-it"; //"deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"

(async () => {
	//Nedan är ett exempel på hur vi kan skicka in den första prompten. Här skulle vi ju kanske kunna tänka oss
	//att vi skickar in "Paris" och "art, cuisine and local history" som variabler in i vår funktion istället.

	const resultAgentOne = await feedbackAgent(
		"Given the destination ‘Paris’ and interests in art, cuisine, and local history, list the top 10 must-see attractions."
	);
	console.log(`Result from agent one is ${resultAgentOne}`);

	//Fortsätt sedan med övriga steg från "Ideas.md" eller kom gärna på egna!

	/*const resultAgentTwo = await feedbackAgent(`Prompt 2`);
	console.log(`Result from agent two is ${resultAgentTwo}`);
	const resultAgentThree = await feedbackAgent(`Prompt 3`);
	console.log(`Result from agent three is ${resultAgentThree}`);*/
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
