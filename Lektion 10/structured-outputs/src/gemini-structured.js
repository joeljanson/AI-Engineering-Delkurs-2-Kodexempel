//https://ai.google.dev/gemini-api/docs/structured-output?lang=node <- resurs
import {
	GoogleGenerativeAI,
	SchemaType,
	HarmCategory,
	HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash-exp",
});

/*
  Uppgiftsinstruktioner:

  I den här uppgiften är ditt mål att definiera ett schema för den strukturerade output som returneras av vår AI-agent (eller LLM).
  Den strukturerade outputen ska följa dessa riktlinjer:

  1. Det ska vara ett objekt (SchemaType.OBJECT) med specifika egenskaper:
     - **title**: (SchemaType.STRING) Detta representerar titeln på blogginlägget.
     - **preamble**: (SchemaType.STRING) En kort introduktion till blogginlägget.
     - **content**: (SchemaType.STRING) Huvudinnehållet i blogginlägget.

  2. Alla tre egenskaper ("title", "preamble" och "content") är obligatoriska (required).

  3. Du är fri att utöka schemat:
     - Du kan lägga till fler egenskaper (t.ex. "author", "date", "tags") om du vill.
     - Om du lägger till extra egenskaper, se till att uppdatera displaylogiken i main.js så att även dessa extra data visas på sidan.

  Använd denna struktur som en utgångspunkt för att experimentera med strukturerade outputs och funktionsanrop i vårt AI-agentprojekt.
  Kom ihåg: Den korrekta lösningen har tagits bort, så fokusera på att förstå den förväntade strukturen och var gärna kreativ!
*/

const schema = {
	//Definiera här ett schema för den strukturerade outputen.
};

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 40,
	maxOutputTokens: 8192,
	responseMimeType: "application/json",
	responseSchema: schema,
};

async function callGemini(prompt) {
	const chatSession = model.startChat({
		generationConfig,
		history: [],
	});

	const result = await chatSession.sendMessage(
		prompt ||
			"Could you write me a blog post about the benefits of using AI in the workplace?"
	);
	return JSON.parse(result.response.text());
}

export { callGemini };
