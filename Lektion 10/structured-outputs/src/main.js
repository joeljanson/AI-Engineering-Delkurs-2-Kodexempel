import './style.css'
import { callGemini } from './gemini-structured.js'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Gemini Structured Output Demo</h1>
    
    <div class="input-section">
      <label for="prompt">Enter your blog post topic:</label>
      <input type="text" id="prompt" placeholder="e.g., Benefits of using AI in the workplace">
      <button id="generate-btn">Generate Blog Post</button>
    </div>
    
    <div class="loading-indicator" id="loading">
      <div class="spinner"></div>
      <p>Generating content...</p>
    </div>
    
    <div class="output-section" id="output">
      <div id="blog-title"></div>
      <div id="blog-preamble"></div>
      <div id="blog-content"></div>
    </div>
  </div>
`

// Hide loading indicator initially
document.getElementById('loading').style.display = 'none';

// Add event listener to the generate button
document.getElementById('generate-btn').addEventListener('click', async () => {
  const promptInput = document.getElementById('prompt');
  const prompt = promptInput.value || "Could you write me a blog post about the benefits of using AI in the workplace?";
  
  // Show loading indicator
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('output').style.display = 'none';
  
  try {
    // Call the Gemini API
    const result = await callGemini(prompt);
    
    // Display the structured output
    document.getElementById('blog-title').innerHTML = `<h2>${result.title}</h2>`;
    document.getElementById('blog-preamble').innerHTML = `<p class="preamble">${result.preamble}</p>`;
    document.getElementById('blog-content').innerHTML = `<div class="content">${result.content}</div>`;
    
    // Show the output section
    document.getElementById('output').style.display = 'block';
  } catch (error) {
    console.error('Error generating content:', error);
    document.getElementById('output').innerHTML = `<div class="error">Error generating content: ${error.message}</div>`;
    document.getElementById('output').style.display = 'block';
  } finally {
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';
  }
});
