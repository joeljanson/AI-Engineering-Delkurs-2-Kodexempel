# Simple Blog

A minimalist blog application built with Vite and vanilla JavaScript that uses Google's Gemini API to generate blog posts based on Wikipedia searches.

## Features

- Single page application
- Search for any topic to generate a blog post
- Uses Google's Gemini API with function calling to search Wikipedia
- Responsive design
- Dark/light mode support (based on system preferences)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Google Gemini API key

### API Key Setup

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
2. Create a `.env` file in the project root
3. Add your API key to the `.env` file:
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

To preview the production build:

```bash
npm run preview
```

## How It Works

1. User enters a search query in the input field
2. The application sends the query to the Gemini API
3. Gemini recognizes the need to search for information and calls the `searchWikipedia` function
4. The application fetches information from Wikipedia about the query
5. The Wikipedia information is sent back to Gemini
6. Gemini generates a blog post based on the Wikipedia information
7. The blog post is displayed to the user

## Project Structure

- `index.html` - Main HTML file
- `src/main.js` - Main JavaScript file that initializes the application
- `src/geminiApi.js` - Handles the integration with Google's Gemini API
- `src/style.css` - CSS styles for the application

## Future Enhancements

- Add pagination for multiple blog posts
- Add categories and tags for blog posts
- Add search functionality for existing blog posts
- Implement caching for API responses
- Add more sources beyond Wikipedia

## License

MIT 