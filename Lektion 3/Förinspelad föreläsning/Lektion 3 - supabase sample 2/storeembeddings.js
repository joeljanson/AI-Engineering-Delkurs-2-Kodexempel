require("dotenv").config();
const fs = require("fs");
const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN);

function cosineSimilarity(vecA, vecB) {
	const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
	const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
	const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
	return dotProduct / (magnitudeA * magnitudeB);
}

async function createAndStoreEmbeddings() {
	//`Represent this sentence for searching relevant passages: ${searchSentence}`,
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

	const data = sentences.map((sentence, index) => ({
		sentence,
		embedding: embeddings[index],
	}));

	//console.log(data);
	console.log("Längden på embeddingen är: ", embeddings[0].length);

	fs.writeFileSync("embeddings.json", JSON.stringify(data, null, 2));
	console.log("Embeddingsarna har sparats till json");
}

createAndStoreEmbeddings();
