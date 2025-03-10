# Gemini Structured Output Demo

A simple demo application showing how to use Google's Gemini API with structured outputs in a vanilla JavaScript application.

## Features

- Generate blog posts with structured output (title, preamble, and content)
- Simple and clean UI
- Real-time API integration with Google's Gemini API

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   You can get an API key from the [Google AI Studio](https://makersuite.google.com/app/apikey).

4. Start the development server:
   ```
   npm run dev
   ```

## How to Use

1. Enter a topic for your blog post in the input field
2. Click the "Generate Blog Post" button
3. Wait for the API to generate the content
4. View the structured output with title, preamble, and content

## Technical Details

This application demonstrates how to:
- Define a schema for structured output with the Gemini API
- Process and display the structured response
- Handle loading states and errors

## Dependencies

- Vite for build tooling
- Google Generative AI SDK for JavaScript
- dotenv for environment variable management 