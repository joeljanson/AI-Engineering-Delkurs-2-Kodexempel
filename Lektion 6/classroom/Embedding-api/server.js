const express = require("express");
const { pipeline, env } = require("@huggingface/transformers");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv/config");

const app = express();
const PORT = 3000;

let textEmbeddingPipeline;

/* 
Om vi vill ladda hem modeller till våran node server och ladda dem lokalt istället från
HuggingFace så kan vi lägga till nedanstående rader.

env.localModelPath ska peka på den mapp där du lägger dina modeller.
env.allowRemoteModels = false gör att vi berättar för transformers.js att inte ladda modeller från HuggingFace.

Cachade modeller ligger under node_modules/@huggingface/.cache efter att man har laddat hem dem första gången.
Dessa kan alltså inte vara utkommenterade första gången man kör koden.

*/
//env.localModelPath = "./models";
//env.allowRemoteModels = false;

// Vi laddar modellen när servern startas.
(async () => {
	try {
		console.log("Loading model...");
		textEmbeddingPipeline = // Skapa här en transformers.js pipeline för vald embedding modell, ex. mixedbread-ai/mxbai-embed-large-v1
			console.log("Model loaded successfully!");
	} catch (err) {
		console.error("Error loading model:", err);
		process.exit(1);
	}
})();

app.use(express.json());

const supabase = //Sätt upp en supabase client createClient med era nycklar. Här behövs URL och er Service Role Key.
	app.post("/embed-text", async (req, res) => {
		try {
			const { text } = req.body;

			if (!text) {
				return res.status(400).json({ error: "No text provided" });
			}

			//Anropa er variabel som ni nu har laddat modellen med (ni behöver använda pooling: cls för att få tillbaka en embedding)
			const tensor = await textEmbeddingPipeline(text, { pooling: "cls" });

			//Hör om embeddingen till en array som vi kan spara i databasen.
			const embeddings = Array.from(tensor.data);

			// Här behöver ni lägga till en supabase.insert som lägger till embeddingen och texten ni skickar in i API:et
			// i er databas

			//Skicka en response så vi får ett svar
			res.json({ embeddings });
		} catch (err) {
			console.error("Error generating embeddings:", err);
			res.status(500).json({ error: "Failed to generate embeddings" });
		}
	});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
