//Importera @huggingface/inference HfInference

export async function generateEmbeddings(text) {
	try {
		const embeddings = await client.featureExtraction({
			model: "välj modell från huggingface",
			inputs: text,
		});
		return "Embedding"; //Här vill vi returnera våra embeddings från vår modell.
	} catch (error) {
		console.log("There was an error generating the embeddings.");
	}
}
