import { generateEmbedding } from "./common";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY
);

async function uploadTextToDatabase(text) {
	try {
		/* const {
			data: { user },
		} = await supabase.auth.getUser();

		console.log(user); */

		console.log("Skickar anrop till HuggingFace med texten: ", text);
		const embedding = await generateEmbedding(text);
		console.log("Embedding skapad! Skickar anrop till databasen!: ", embedding);
		if (embedding.length > 0) {
			const { data, error } = await supabase.from("documents").insert([
				{
					sentence: text,
					embedding: embedding, // Use the first embedding (only one text input)
				},
			]);
			if (error) {
				console.log("Could not insert data correctly. Error: ", error);
			} else {
				console.log("Data was successfully inserted! YES! Data: ", data);
			}
		}
		//2. Ladda upp embedding och text till databasen!
	} catch (error) {
		console.log("Something went wrong! Error: ", error);
	}
}

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const uploadText = document.getElementById("uploadText");
	const text = uploadText.value;

	if (text.length > 0) {
		console.log("User wants to upload text to the database: ", text);

		// Anropa en function som genererar en embedding och laddar upp till vår databas.
		await uploadTextToDatabase(text);
		console.log("Text and embedding was uploaded");
		uploadText.value = "";
	}
});
