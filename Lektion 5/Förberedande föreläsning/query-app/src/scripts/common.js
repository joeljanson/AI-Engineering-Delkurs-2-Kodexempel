import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN);

export async function generateEmbedding(text) {
	try {
		const embeddings = await client.featureExtraction({
			model: "mixedbread-ai/mxbai-embed-large-v1",
			inputs: text,
			options: { wait_for_model: true },
		});
		return embeddings;
	} catch (error) {
		console.log("Error generating embeddings: ", error);
	}
}
