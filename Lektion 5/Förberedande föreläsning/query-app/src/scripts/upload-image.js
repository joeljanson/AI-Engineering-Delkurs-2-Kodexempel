import { generateEmbedding } from "./common";
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@huggingface/transformers";
import { HfInference } from "@huggingface/inference";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY
);

document
	.getElementById("uploadImageForm")
	.addEventListener("submit", async (e) => {
		e.preventDefault();
		const imageInput = document.getElementById("imageInput");
		console.log("image input: ", imageInput.files);
		if (!imageInput.files || imageInput.files.length === 0) {
			alert("Du måste ladda upp en bild.");
		}
		const file = imageInput.files[0];
		console.log("User wants to upload an image to the database: ", file);

		const imageEmbeddings = await generateImageEmbeddings(file);
		const imageCaption = await generateImageCaption(file);
		const imageCaptionEmbedding = await generateEmbedding(imageCaption);
		console.log("Image caption is:", imageCaption);
		console.log("Image caption embedding is: ", imageCaptionEmbedding);
		console.log("Image embedding.length is: ", imageEmbeddings.length);

		const fileRef = await uploadImage(
			file,
			imageEmbeddings,
			imageCaption,
			imageCaptionEmbedding
		);
		console.log(fileRef);

		//1. skicka upp bilden till supabase storage
		//2. skicka upp vår caption, embedding och image embedding till en ny tabell som heter images.
		/*
        id = uuid
        caption = text
        embedding = vector(1024)
        image_embedding = vector(512)
        user_id = uuid
        file_reference = text
        created_at = timestamp
        */
	});

let imageFeatureExtractor = null;

async function getImageFeatureExtractor() {
	if (!imageFeatureExtractor) {
		imageFeatureExtractor = await pipeline(
			"image-feature-extraction",
			"Xenova/clip-vit-base-patch32"
		);
	}
	return imageFeatureExtractor;
}

async function generateImageEmbeddings(file) {
	try {
		const extractor = await getImageFeatureExtractor();

		const url = URL.createObjectURL(file);

		const features = await extractor(url);

		const embeddings = Array.from(features.data);
		return embeddings;
	} catch (error) {
		console.log("Image caption could not be created: ", error);
	}
}

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_ACCESS_TOKEN);

async function generateImageCaption(file) {
	const fileContent = await file.arrayBuffer();

	const caption = await client.imageToText({
		model: "nlpconnect/vit-gpt2-image-captioning",
		data: fileContent,
	});

	console.log(caption.generated_text);
	return caption.generated_text;
}

async function uploadImage(
	file,
	imageEmbedding,
	imageCaption,
	imageCaptionEmbedding
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	const userId = session.user.id;
	const bucketName = "images";
	const fileName = `${userId}/${Date.now()}-${file.name}`;

	const { data, error } = await supabase.storage
		.from(bucketName)
		.upload(fileName, file);
	if (error) {
		console.error("Error uploading file: ", error);
		return null;
	}

	const { error: dbError } = await supabase.from("images").insert({
		caption: imageCaption,
		embedding: imageCaptionEmbedding,
		image_embedding: imageEmbedding,
		user_id: userId,
		file_reference: `${fileName}`,
	});

	if (dbError) {
		console.error("Error inserting data into images table: ", dbError);
		return null;
	}

	console.log("Image successfully uploaded to storage and images table!");
	return { fileReference: `${bucketName}/${fileName}` };
}
