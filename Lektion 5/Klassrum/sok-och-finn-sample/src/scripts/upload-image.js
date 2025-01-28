import { pipeline } from "@huggingface/transformers";

document
	.getElementById("uploadImageForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		const fileInput = document.getElementById("imageInput");

		if (!fileInput.files || fileInput.files.length === 0) {
			alert("You must chose an image file to embed.");
			return;
		}
		const file = fileInput.files[0];
		const imageEmbeddings = await generateImageEmbeddings(file);
	});

async function generateImageEmbeddings(file) {
	//const start = Date.now();
	console.log("Trying to start the pipeline");
	const imageEmbeddingExtractor = await pipeline(
		"image-feature-extraction",
		"Xenova/clip-vit-base-patch32"
	);

	const url = URL.createObjectURL(file);

	console.log("Running the model with the url");
	const embeddings = await imageEmbeddingExtractor(url);
	const embedding = Array.from(embeddings.data);
	console.log("finished running the model");
	console.log(embedding);
}
