import './style.css'
import { searchWithGemini } from './geminiApi.js';

// Function to fetch blog content using Gemini LLM
async function fetchBlogContent() {
  const searchInput = document.querySelector('#search-input').value.trim();
  
  if (!searchInput) {
    alert('Please enter a search term');
    return;
  }
  
  console.log("Searching for information about:", searchInput);
  
  // Simulate loading state
  const blogContainer = document.querySelector('.blog-content');
  blogContainer.innerHTML = '<p class="loading">Searching for information about "' + searchInput + '"...</p>';
  
  try {
    // Call the Gemini API directly
    const data = await searchWithGemini(searchInput);
    
    // Display the blog content
    blogContainer.innerHTML = `
      <article class="blog-post">
        <h2>${data.title || 'Results for: ' + searchInput}</h2>
        <p class="preamble">${data.preamble || 'Here\'s what we found about your search.'}</p>
        <div class="main-content">
          ${data.content || '<p>No detailed information found.</p>'}
        </div>
      </article>
    `;
  } catch (error) {
    console.error('Error fetching blog content:', error);
    blogContainer.innerHTML = `
      <div class="error-message">
        <h3>Error</h3>
        <p>Sorry, we couldn't fetch information about "${searchInput}". Please try again later.</p>
        <p class="error-details">Technical details: ${error.message}</p>
      </div>
    `;
  }
}

// Initialize the blog app
document.querySelector('#app').innerHTML = `
  <div class="blog-container">
    <header>
      <h1>Simple Blog</h1>
      <p class="tagline">Search for any topic to generate a blog post</p>
    </header>
    
    <main>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Enter a topic to search..." class="search-input">
        <button id="fetch-blog" class="primary-button">Generate Blog Post</button>
      </div>
      
      <div class="blog-content">
        <p class="empty-state">Enter a topic above and click "Generate Blog Post" to search for information</p>
      </div>
    </main>
    
    <footer>
      <p>&copy; 2024 Simple Blog | Powered by Gemini API</p>
    </footer>
  </div>
`

// Add event listener to the fetch button
document.querySelector('#fetch-blog').addEventListener('click', fetchBlogContent);

// Add event listener for Enter key on search input
document.querySelector('#search-input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    fetchBlogContent();
  }
});
