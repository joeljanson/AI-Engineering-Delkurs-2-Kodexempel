import { generateEmbeddings } from "./common";

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const uploadTextField = document.getElementById("uploadText");
	const textToUpload = uploadTextField.value;
	if (textToUpload.length > 0) {
		console.log("User wants to upload text: ", textToUpload);
		//Generera embeddings + skicka upp till databasen.
		uploadTextField.value = "";
	}
});
