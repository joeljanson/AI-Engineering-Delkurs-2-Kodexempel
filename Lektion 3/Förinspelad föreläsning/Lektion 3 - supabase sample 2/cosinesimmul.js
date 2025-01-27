require("dotenv").config();
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

function cosineSimilarity(vecA, vecB) {
	const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
	const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
	const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}

async function createAndStoreEmbeddings() {
	const sentences = [
		"A man is eating a piece of bread",
		"A man is eating food",
		"A man is eating pasta",
		"The boy is carrying a baby",
		"A man is riding a horse",
	];

	console.log("Skickar iväg API-anrop till huggingface");
	const embeddings = await client.featureExtraction({
		model: "mixedbread-ai/mxbai-embed-large-v1",
		inputs: sentences,
	});

	const sourceEmbedding = embeddings[0];
	const documentEmbeddings = embeddings.slice(1);

	const similarities = documentEmbeddings.map((embedding, index) => {
		const similarityScore = cosineSimilarity(sourceEmbedding, embedding);
		return {
			sentence: sentences[index + 1],
			similarity: similarityScore,
		};
	});

	similarities.forEach(({ sentence, similarity }) => {
		console.log("Query sentence: ", query);
		console.log("Sentence: ", sentence);
		console.log("Similarity: ", similarity.toFixed(4));
	});
}

createAndCompareEmbeddings();
