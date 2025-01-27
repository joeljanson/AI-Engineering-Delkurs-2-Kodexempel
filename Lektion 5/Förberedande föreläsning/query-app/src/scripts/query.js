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
			console.log("Söker i databas");
			const { data, error } = await supabase.rpc("match_embeddings", {
				query_embedding: embedding,
				match_threshold: matchTreshold,
				match_count: matchCount,
			});
			if (error) {
				console.log("There was an error quering the database", error);
				return [];
			}

			const resultsWithUrls = await Promise.all(
				data.map(async (result) => {
					if (result.content_type === "image" && result.file_reference) {
						const { data: signedUrlData, error: urlError } =
							await supabase.storage
								.from("images")
								.createSignedUrl(result.file_reference, 60);
						if (urlError) {
							console.error("Error generating url: ", urlError);
						} else {
							result.signedUrl = signedUrlData.signedUrl;
						}
					}
					return result;
				})
			);

			return resultsWithUrls;
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

				if (result.content_type === "image" && result.signedUrl) {
					resultElement.innerHTML = `<h3>Image ID: ${result.id}</h3>
                    <img src="${result.signedUrl}" style="max-width:300px"/>
                    <p><strong>Content: </strong>${result.content}</p>
                    <p><strong>Similarity: </strong>${result.similarity}</p>
                    `;
				} else {
					resultElement.innerHTML = `<h3>Document ID: ${result.id}</h3>
                    <p><strong>Content: </strong>${result.content}</p>
                    <p><strong>Similarity: </strong>${result.similarity}</p>
                    `;
				}

				resultsDiv.appendChild(resultElement);
			});
		} else {
			resultsDiv.innerHTML = "<p>No results found unfortunately!</p>";
		}

		queryText.value = "";
	}
});
