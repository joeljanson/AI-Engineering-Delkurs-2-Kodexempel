import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/*
  Uppgiftsinstruktioner:

  I den här uppgiften ska du arbeta med funktionsanrop i vår AI-agent. 
    
  Uppgiften är att du ska skapa en funktion som kan användas för att söka på Wikipedia.
  Själva funktionen är redan skriven (se nedan). Det du behöver göra är att skicka in en functionDeclaration till Gemini.

  1. **Verktyg och funktionsdeklarationer:**
     - Verktyget ska ha en funktionsdeklaration för funktionen "searchWikipedia".
     - **searchWikipedia**:
       - **description:** Kom på en bra beskrivning för denna funktion
       - **parameters:** Funktionen ska ta emot ett objekt med en obligatorisk (required) egenskap, nämligen:
         - **query** (Sträng): Sökfrågan att använda för Wikipedia-sökningen.
  
  2. **Automatisk funktionsanropning:**
     - Verktyget är konfigurerat med "functionCallingConfig" inställt på "AUTO", vilket innebär att systemet automatiskt kommer att anropa funktionen baserat på behov.
  
  
*/

export async function searchWithGemini(query) {
	try {
		// Initialize the model with function calling capabilities
		const model = genAI.getGenerativeModel({
			model: "gemini-2.0-flash-exp",
			tools: [
				{
					functionDeclarations: [
						//Implementera här en funktionsdeklaration
					],
				},
			],
			toolConfig: { functionCallingConfig: { mode: "AUTO" } },
		});

		// Configuration for the generation
		const generationConfig = {
			temperature: 1,
			topP: 0.95,
			topK: 40,
			maxOutputTokens: 8192,
		};

		// Start a chat session
		const chatSession = model.startChat({
			generationConfig,
			history: [],
		});

		// Send the initial message to Gemini
		let response = await chatSession.sendMessage(
			`Find information about: ${query}`
		);

		// Process the response and handle function calls
		let finalResponse = {
			title: `Information about ${query}`,
			preamble: "Here's what I found:",
			content: "",
		};

		let functionCalled = false;

		// Check if there's a function call in the response
		for (const candidate of response.response.candidates || []) {
			for (const part of candidate.content.parts || []) {
				if (part.functionCall) {
					functionCalled = true;
					const functionName = part.functionCall.name;
					const args = part.functionCall.args;

					console.log(`Function called: ${functionName} with args:`, args);

					// Wikipedia search function
					const wikipediaResult = await searchWikipedia(args.query);

					// Send the function result back to Gemini
					response = await chatSession.sendMessage([
						{
							functionResponse: {
								name: functionName,
								response: { content: wikipediaResult },
							},
						},
					]);

					// Format the final response from Gemini
					finalResponse.content = formatGeminiResponse(
						response.response.text()
					);
					break;
				}
			}
			if (functionCalled) break;
		}

		// If no function was called, use the direct response
		if (!functionCalled) {
			finalResponse.content = formatGeminiResponse(response.response.text());
		}

		console.log(finalResponse);

		return finalResponse;
	} catch (error) {
		console.error("Error in Gemini API:", error);
		throw new Error(`Gemini API error: ${error.message}`);
	}
}

// Function to search Wikipedia using their API
async function searchWikipedia(query) {
	console.log(`Searching Wikipedia for: ${query}`);

	try {
		// Encode the query for URL
		const encodedQuery = encodeURIComponent(query);

		// Wikipedia API endpoint for searching
		const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`;

		// Fetch search results
		const searchResponse = await fetch(searchUrl);
		const searchData = await searchResponse.json();

		// If no results, return a message
		if (!searchData.query.search.length) {
			return `No Wikipedia results found for "${query}".`;
		}

		// Get the first result
		const topResult = searchData.query.search[0];
		const pageId = topResult.pageid;

		// Fetch the content of the page
		const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&pageids=${pageId}&format=json&origin=*`;
		const contentResponse = await fetch(contentUrl);
		const contentData = await contentResponse.json();

		// Extract the content
		const page = contentData.query.pages[pageId];
		const title = page.title;
		const extract = page.extract;

		// Format the response
		return `
      <h3>${title}</h3>
      <p>${extract}</p>
      <p><a href="https://en.wikipedia.org/?curid=${pageId}" target="_blank">Read more on Wikipedia</a></p>
    `;
	} catch (error) {
		console.error("Error searching Wikipedia:", error);
		return `Error searching Wikipedia for "${query}": ${error.message}`;
	}
}

// Helper function to format the Gemini response as HTML
function formatGeminiResponse(text) {
	// Convert plain text to HTML paragraphs
	return text
		.split("\n\n")
		.map((paragraph) => paragraph.trim())
		.filter((paragraph) => paragraph.length > 0)
		.map((paragraph) => `<p>${paragraph}</p>`)
		.join("");
}
