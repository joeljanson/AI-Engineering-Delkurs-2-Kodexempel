document.getElementById("queryForm").addEventListener("submit", async (e) => {
	e.preventDefault();
	const queryTextField = document.getElementById("queryText");
	const query = queryTextField.value;
	if (query.length > 0) {
		console.log("User wants to query the database: ", query);
		//Generera embeddings + fråga efter relevanta dokument i databasen
		queryTextField.value = "";
	}
});
