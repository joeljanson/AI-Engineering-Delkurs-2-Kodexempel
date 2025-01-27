require("dotenv").config();
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

function cosineSimilarity(vecA, vecB) {
	const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
	const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
	const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}

async function createAndCompareEmbeddings() {
	const sentences = [
		"What is the capital of sweden?",
		"The capital of Sweden is Oslo",
	];

	console.log("Skickar iväg API-anrop till huggingface");
	const embeddings = await client.featureExtraction({
		model: "mixedbread-ai/mxbai-embed-large-v1",
		inputs: sentences,
	});

	//console.log(embeddings);

	const embedding1 = embeddings[0];
	const embedding2 = embeddings[1];

	console.log("Beräknar likheten mellan dessa två embeddings");
	const similarity = cosineSimilarity(embedding1, embedding2);

	console.log(
		`The cosine similarity between the two sentences are: ${similarity}`
	);
}

createAndCompareEmbeddings();
