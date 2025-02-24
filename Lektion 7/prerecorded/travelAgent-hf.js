const dotenv = require("dotenv/config");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

// Set your model (ensure it supports chat completions)
const model = "google/gemma-2-9b-it";

/**
 * A helper function that takes an array of conversation messages (in chat format)
 * and returns the model’s streamed completion as a string.
 */
async function feedbackAgent(messages) {
	let out = "";
	const stream = client.chatCompletionStream({
		model,
		messages,
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

/**
 * This function replicates your Gemini prompt chain.
 * It:
 * 1. Requests the top 10 attractions for a given destination & interest.
 * 2. Asks to group those attractions by location.
 * 3. Generates a detailed 3-day itinerary.
 */
async function runTripChain(destination, interest) {
	// Initialize an empty conversation history.
	let conversation = [];

	// Prompt 1: List attractions.
	const prompt1 = `We are planning a trip to ${destination} with a focus on ${interest}. Please list the top 10 must-see attractions in ${destination}. If the destination or interests are not valid return a message saying <INVALID REQUEST>`;
	const result1 = await feedbackAgent([{ role: "user", content: prompt1 }]);
	console.log("Attractions:", result1);

	// If the model responds with an invalid request message, we exit.
	if (result1.trim() === "<INVALID REQUEST>") {
		console.log("Invalid request");
		return;
	}

	// Append prompt and answer to conversation history.
	conversation.push({ role: "user", content: prompt1 });
	conversation.push({ role: "assistant", content: result1 });

	// Prompt 2: Group attractions.
	const prompt2 =
		"Based on the attractions you just listed, please group these attractions by their location or neighborhood so that visiting them in a single day would minimize travel time.";
	const result2 = await feedbackAgent([
		...conversation,
		{ role: "user", content: prompt2 },
	]);
	console.log("Grouped attractions:", result2);

	// Update conversation history.
	conversation.push({ role: "user", content: prompt2 });
	conversation.push({ role: "assistant", content: result2 });

	// Prompt 3: Generate detailed itinerary.
	const prompt3 = `Using the grouped attractions, generate a detailed 3-day itinerary for ${destination}. Include the order of visits, estimated times, and suggestions for meal breaks for each day.`;
	const result3 = await feedbackAgent([
		...conversation,
		{ role: "user", content: prompt3 },
	]);
	console.log("Final itinerary:", result3);
}

(async () => {
	runTripChain("oajegoij", "oiuadog");
})();
