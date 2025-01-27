import { generateEmbedding } from "./common";
import { createClient } from "@supabase/supabase-js";
import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN);

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY
);

async function queryDatabase(query, matchTreshold = 0.2, matchCount = 5) {
	try {
		console.log("Anropar huggingface");
		const embedding = await generateEmbedding(
			`Represent this sentence for searching relevant passages: ${query}`
		);
		if (embedding.length > 0) {
			console.log("Sparar till databas");
			const { data, error } = await supabase.rpc("match_embeddings", {
				query_embedding: embedding,
				match_threshold: matchTreshold,
				match_count: matchCount,
			});
			if (error) {
				console.log("There was an error..", error);
				return [];
			}
			console.log("Vår data är: ", data);
			return data;
		}
	} catch (error) {
		console.log("Could not query database for embeddings.");
	}
}

document.getElementById("queryForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const queryText = document.getElementById("queryText");
	const text = queryText.value;

	if (text.length > 0) {
		console.log("User wants to query the database: ", text);

		// Anropa en function som genererar en embedding och laddar upp till vår databas.
		const results = await queryDatabase(text);

		console.log("Results are: ", results);

		const resultsDiv = document.getElementById("responseText");
		if (results.length > 0) {
			results.forEach((result) => {
				const resultElement = document.createElement("div");
				resultElement.innerHTML = `<h3>Document ID: ${result.id}<h3><p>${
					result.content
				}</p><p><strong>Similarity: ${result.similarity.toFixed(
					4
				)}</strong></p>`;
				resultsDiv.appendChild(resultElement);
			});
		} else {
			resultsDiv.innerHTML = "<p>No results found unfortunately!</p>";
		}

		const chatbotResponse = await handleChatbotPrompt(results, text);
		console.log("Ourr augmented response is: ", chatbotResponse);

		console.log("Text and embedding was uploaded");
		queryText.value = "";
	}
});

async function handleChatbotPrompt(results, queryText) {
	if (results.length > 0) {
		const topResults = results.slice(0, 3);
		const context = topResults.map(
			(result, index) => `Document ${index}: ${result.content}`
		);

		const message = `
        You are an AI assistant tasked with answering questions based on provided context information. Your goal is to use the given context to provide accurate and relevant answers to user queries. The queries will be in any language but you should always answer in swedish.

First, here is the context information you should use to inform your answers:

<context>
{${context}}
</context>

Now, I will present you with a question from a user. Your task is to answer this question using only the information provided in the context above. Do not use any external knowledge or information that is not contained within the given context.

Here is the user's question:

<question>
{${queryText}}
</question>

Please follow these steps to formulate your response:

1. Carefully read and analyze the provided context.
2. Identify information within the context that is relevant to answering the user's question.
3. Formulate a clear and concise answer based solely on the relevant information from the context.
4. If the context does not contain sufficient information to fully answer the question, state this clearly in your response.

Present your answer in the following format in Swedish in a text that rhymes:
<answer>
[Ditt svar här]
</answer>
If you cannot answer the question based on the given context, your response should be:

I apologize, but I don't have enough information in the provided context to answer this question accurately.

Remember, your goal is to provide accurate information based on the given extra context. Do not speculate or include information from outside the provided context.

        `;

		const chatbotResponse = queryChatbot(message);
		console.log(chatbotResponse);
		return chatbotResponse;
	}
}

async function queryChatbot(message) {
	try {
		let out = "";

		console.log(message);
		const stream = client.chatCompletionStream({
			model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
			messages: [{ role: "user", content: message }],
			temperature: 0.5,
			max_tokens: 1000,
		});

		for await (const chunk of stream) {
			if (chunk.choices && chunk.choices.length > 0) {
				const newContent = chunk.choices[0].delta.content;
				out += newContent;
			}
		}
		return out;
	} catch (error) {
		console.error("Could not call chatbot: ", error);
	}
}
