document.addEventListener('DOMContentLoaded', function() {
    // --- Color Settings ---
    const bgColorInput = document.getElementById('bgColor');
    const textColorInput = document.getElementById('textColor');

    function applyColorSettings(bgColor, textColor) {
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = textColor;
    }

    function loadColorSettings() {
        const bgColor = localStorage.getItem('bgColor') || '#ffffff'; // Default white
        const textColor = localStorage.getItem('textColor') || '#333333'; // Default dark grey
        bgColorInput.value = bgColor;
        textColorInput.value = textColor;
        applyColorSettings(bgColor, textColor);
    }

    function saveColorSettings(bgColor, textColor) {
        localStorage.setItem('bgColor', bgColor);
        localStorage.setItem('textColor', textColor);
    }

    bgColorInput.addEventListener('input', function() {
        const bgColor = bgColorInput.value;
        const textColor = textColorInput.value;
        applyColorSettings(bgColor, textColor);
        saveColorSettings(bgColor, textColor);
    });

    textColorInput.addEventListener('input', function() {
        const bgColor = bgColorInput.value;
        const textColor = textColorInput.value;
        applyColorSettings(bgColor, textColor);
        saveColorSettings(bgColor, textColor);
    });

    // --- Blog Post Creation ---
    const postForm = document.getElementById('post-form');
    const postTitleInput = document.getElementById('post-title');
    const postContentInput = document.getElementById('post-content');

    function createPost(title, content) {
        const now = new Date();
        const post = {
            title: title,
            content: content,
            date: now.toLocaleString(),
            id: Date.now() // Unique ID for each post
        };
        return post;
    }

    function savePost(post) {
        let posts = getPosts();
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = postTitleInput.value;
        const content = postContentInput.value;

        const newPost = createPost(title, content);
        savePost(newPost);

        postTitleInput.value = '';
        postContentInput.value = '';

        displayPostList();
        alert('Post published!');
    });

    // --- Blog Post Display ---
    const postListDiv = document.getElementById('post-list');
    const postDetailDiv = document.getElementById('post-detail');
    const backToListButton = document.getElementById('back-to-list');

    function displayPostList() {
        const posts = getPosts();
        renderPostList(posts);
        postDetailDiv.style.display = 'none';
        postListDiv.style.display = 'flex';
    }

    function displayPostDetail(postId) {
        const posts = getPosts();
        const post = posts.find(post => post.id === postId);
        if (post) {
            renderPostDetail(post);
            postListDiv.style.display = 'none';
            postDetailDiv.style.display = 'block';
        }
    }

    function getPosts() {
        const postsJSON = localStorage.getItem('posts');
        return postsJSON ? JSON.parse(postsJSON) : [];
    }

    function renderPostList(posts) {
        postListDiv.innerHTML = ''; // Clear existing list

        posts.forEach(post => {
            const postItemDiv = document.createElement('div');
            postItemDiv.classList.add('post-item');

            const titleLink = document.createElement('a');
            titleLink.href = '#';
            titleLink.textContent = post.title;
            titleLink.classList.add('post-title-link');
            titleLink.addEventListener('click', function(event) {
                event.preventDefault();
                displayPostDetail(post.id);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', function() {
                deletePost(post.id);
                displayPostList();
            });

            postItemDiv.appendChild(titleLink);
            postItemDiv.appendChild(deleteButton);
            postListDiv.appendChild(postItemDiv);
        });
    }

    function renderPostDetail(post) {
        postDetailDiv.innerHTML = '';

        const titleElement = document.createElement('h3');
        titleElement.textContent = post.title;

        const dateElement = document.createElement('p');
        dateElement.textContent = 'Published on: ' + post.date;

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;

        postDetailDiv.appendChild(titleElement);
        postDetailDiv.appendChild(dateElement);
        postDetailDiv.appendChild(contentElement);
    }

    backToListButton.addEventListener('click', function() {
        displayPostList();
    });

    // --- Delete Blog Post ---
    function deletePost(postId) {
        let posts = getPosts();
        posts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(posts));
        alert('Post deleted!');
    }

    // --- Initial Load and Display ---
    loadColorSettings();
    displayPostList();
});