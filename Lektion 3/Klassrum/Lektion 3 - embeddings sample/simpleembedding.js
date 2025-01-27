const { HfInference } = require("@huggingface/inference");

const client = new HfInference(process.env.HF_TOKEN);

async function generateEmbeddingWithMixedBread(text) {
	const embedding = await client.featureExtraction({
		model: "mixedbread-ai/mxbai-embed-large-v1",
		inputs: text,
		//options: {wait_for_model: true}
	});
	console.log(`Our embedding is: ${embedding}`);
	console.log(`Our embedding length (dimension) is: ${embedding.length}`);
}

generateEmbeddingWithMixedBread("This is a great day!");

//mixedbread-ai/mxbai-embed-large-v1
