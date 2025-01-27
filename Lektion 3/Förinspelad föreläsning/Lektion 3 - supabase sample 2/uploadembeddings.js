require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const embeddings = require("./embeddings.json");
const { error } = require("console");

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

async function uploadData() {
	console.log(embeddings);
	for (const item of embeddings) {
		const { data, error } = await supabase
			.from("documents")
			.insert([{ sentence: item.sentence, embedding: item.embedding }]);
		if (error) {
			console.log("Could not insert data correctly. Error: ", error);
		} else {
			console.log("Data was successfully inserted! YES! Data: ", data);
		}
	}
}

uploadData();
