require("dotenv").config();
const { pipeline } = require("@huggingface/transformers");
const { createClient } = require("@supabase/supabase-js");

const fs = require("fs");
const csv = require("csv-parser");

// Läser in de 1000 första recensionerna från CSV
async function readCSV(filePath) {
	return new Promise((resolve, reject) => {
		const reviews = [];
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (row) => {
				if (reviews.length < 1000) {
					reviews.push(row.review); // Extraherar text från "review"-kolumnen
				}
			})
			.on("end", () => resolve(reviews))
			.on("error", (error) => reject(error));
	});
}

// Initiera Supabase - Här behöver ni lägga till eran supabase url och supabase service role key
const supabase = createClient();

//En async function som sätter igång våra anrop när vi kör node upload-embeddings.js
(async () => {
	//Funktion som kan skapa embeddings i batches och sedan lagrar dem i supabase.
	await insertMultipleEmbeddingsFromCSV();

	/*
    
    Utkommenterade funktioner som används senare vid semantisk sökning

    const query =
		"I want to find a movie that's really great, a comedy that also is romantic.";

	const queryEmbedding = await generateEmbedding(query);
	await searchSimilar(queryEmbedding);
    
    */
})();

async function insertMultipleEmbeddingsFromCSV() {
	console.log("Läser in CSV och genererar embeddingar...");

	//Laddar in de 1000 första raderna i denna csvn.
	const reviews = await readCSV("imdb-reviews.csv");

	// Bearbeta i batchar om 50 rader åt gången
	const batchSize = 50;
	for (let i = 0; i < reviews.length; i += batchSize) {
		const batch = reviews.slice(i, i + batchSize);

		const embeddings = await generateEmbeddingsBatch(batch);

		const rows = batch.map((text, index) => ({
			text,
			embedding: embeddings[index],
		}));

		/* 
        
        Här behöver ni ladda upp embeddings till supabase (se supabase.insert) 

        */

		if (error) console.error("Fel vid uppladdning:", error);
		else console.log(`Lagt till ${batch.length} rader...`);
	}
}

async function generateEmbeddingsBatch(texts) {
	const extractor = await pipeline(
		"feature-extraction",
		"sentence-transformers/all-MiniLM-L6-v2"
	);

	// Skicka in flera texter på en gång för snabbare bearbetning
	const outputs = await extractor(texts, {
		pooling: "mean",
		normalize: true,
	});

	return outputs.tolist();
}

// Skapa en embedding pipeline
async function generateEmbedding(text) {
	//Det här är en mindre modell som skapar embeddings som har en storlek på 384
	const extractor = await pipeline(
		"feature-extraction",
		"Xenova/all-MiniLM-L6-v2"
	);

	// Generera embedding och konvertera till array
	const output = await extractor(text, {
		pooling: "mean",
		normalize: true,
	});

	return Array.from(output.data);
}

/* Sök funktionen - Skickar in en embedding */
async function searchSimilar(queryEmbedding) {
	console.log("Söker efter liknande meningar...");

	/*
        Här behöver ni anropa Supabase och köra den funktionen ni skapade i Supabase
        tips supabase.rpc!
        Se till att ha lagom threshold och match_limit
    */

	if (error) {
		console.error("Fel vid sökning:", error);
	} else {
		console.log("Top 3 resultat:");
		data.forEach((result, index) =>
			console.log(`${index + 1}. ${result.text} (Likhet: ${result.similarity})`)
		);
	}
}
