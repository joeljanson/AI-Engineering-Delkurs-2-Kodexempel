import { generateEmbedding } from "./common";
import { createClient } from "@supabase/supabase-js";

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
			const { data, error } = await supabase.rpc("match_documents", {
				query_embedding: embedding,
				match_treshold: matchTreshold,
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
					result.sentence
				}</p><p><strong>Similarity: ${result.similarity.toFixed(
					4
				)}</strong></p>`;
				resultsDiv.appendChild(resultElement);
			});
		} else {
			resultsDiv.innerHTML = "<p>No results found unfortunately!</p>";
		}

		console.log("Text and embedding was uploaded");
		queryText.value = "";
	}
});
