import { API_BASE_URL, API_BLOGPOSTS_URL, getBlogPostUrl } from "./scripts/constants.mjs";
import { authFetch } from "./scripts/utils/authFetch.mjs";
import { doFetch } from "./scripts/utils/doFetch.mjs";
import { load } from "./scripts/utils/storage/index.mjs";
import { remove } from "./scripts/utils/storage/index.mjs";
import { createPost } from "./scripts/utils/posts/create.mjs";
import { updatePost } from "./scripts/utils/posts/update.mjs";
import { getPost } from "./scripts/utils/posts/read.mjs";

document.addEventListener('DOMContentLoaded', async function () {
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const postForm = document.getElementById('postForm');
    const postContainer = document.querySelector('.post-container');
    const postDetailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailDate = document.getElementById('detailDate');
    const detailDescription = document.getElementById('detailDescription');
    const detailAuthor = document.getElementById('detailAuthor');
    const detailImage = document.getElementById('detailImage');
    
    const editPostModal = document.getElementById('editPostModal');
    const editPostForm = document.getElementById('editPostForm');
    const editPostId = document.getElementById('editPostId');
    const editPostCategory = document.getElementById('editPostCategory');
    const editPostTitle = document.getElementById('editPostTitle');
    const editPostAuthor = document.getElementById('editPostAuthor');
    const editPostDescription = document.getElementById('editPostDescription');
    const editPostImageInput = document.getElementById('editPostImage');
    const closeEditModal = document.getElementById('closeEditModal');


    createPostBtn.addEventListener('click', function () {
        createPostModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function () {
        createPostModal.classList.add('fadeOut');
        setTimeout(() => {
            createPostModal.style.display = 'none';
            createPostModal.classList.remove('fadeOut');
        }, 500);
    });

    function generateID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    async function loadPosts() {
        var user = load('user');
        if (user) {
            var response = await doFetch(getBlogPostUrl(user.name));
            const posts = response.data;
            posts.forEach(post => {
                displayPost(post);
            });
        }
    }

    postForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const postCategory = document.getElementById('postCategory').value;
        const postTitle = document.getElementById('postTitle').value;
        const postAuthor = document.getElementById('postAuthor').value;
        const postDescription = document.getElementById('postDescription').value;
        const postImageUrl = document.getElementById('postImage');

        if (postCategory.trim() === '' || 
            postTitle.trim() === '' ||
            postAuthor.trim() === '' ||
            postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }

        createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl);
        
    });

    async function createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        const postData = {
            title: postTitle,
            body: postDescription,
            date: formattedDate,
            author: postAuthor,
            tags: [postCategory],
            media: {
                url: 'https://picsum.photos/id/108/2000/1333',
                alt: `${postTitle} image`
            }
        };

        const user = load('user');
        try {
            const response = await authFetch(getBlogPostUrl(user.name));
            if (response) {
                const post = {
                    id: response.id,
                    title: postTitle,
                    body: postDescription,
                    tag: postCategory,
                    author: postAuthor,
                    date: formattedDate,
                    media: postImageUrl
                };
                savePostToLocalStorage(post);
                addPostToDOM(post);
            }
        } catch (error) {
            console.error('Error creating post:', error)
        }

        createPostModal.style.display = 'none';
        postForm.reset();
    }

    function savePostToLocalStorage(post) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function displayPost(post) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-id="${post.id}" data-title="${post.title}" data-date="${post.date}" data-description="${post.body}" data-author="${post.author}">
                ${post.title}
            </h1>
            <h2 class="category">${post.tag}</h2>
            <h3 class="author">${post.author}</h3>
            <span class="post-date">${post.date}</span>
            <p class="post-description">${post.body}...</p>
            <button class="delete-post" data-id="${post.id}">Delete</button>
            <button class="edit-post" data-id="${post.id}">Edit</button>
            <span class="load-more" data-id="${post.id}">Load more</span>
            
        `;

        postContainer.insertBefore(newPost, postContainer.firstChild);
    }

    function addPostToDOM(post) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-id="${post.id}" data-title="${post.title}" data-date="${post.date}" data-description="${post.body}" data-author="${post.author}">
                ${post.title}
            </h1>
            <h2 class="category">${post.tag}</h2>
            <h3 class="author">${post.author}</h3>
            <span class="post-date">${post.date}</span>
            <p class="post-description">${post.body}...</p>
            <button class="delete-post" data-id="${post.id}">Delete</button>
            <button class="edit-post" data-id="${post.id}">Edit</button>
            <span class="load-more" data-id="${post.id}">Load more</span>
            
        `;

        postContainer.insertBefore(newPost, postContainer.firstChild);
    }

    postContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('load-more') ||
            event.target.classList.contains('post-title')) {
            const title = event.target.getAttribute('data-title');
            const author = event.target.getAttribute('data-author');
            const date = event.target.getAttribute('data-date');
            const description = event.target.getAttribute('data-description');

            detailTitle.textContent = title;
            detailAuthor.textContent = author;
            detailDate.textContent = date;
            detailDescription.textContent = description;

            postDetailModal.style.display = 'flex';
        }

        if (event.target.classList.contains('delete-post')) {
            const postId = event.target.getAttribute('data-id');
            deletePost(postId);
        }

        if (event.target.classList.contains('edit-post')) {
            const postId = event.target.getAttribute('data-id');
            editPost(postId);
            editPostModal.style.display = 'flex';
        }
    });

    async function deletePost(postId) {
        const user = load('user');
        try {
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}/${postId}`, { // Replace with your API URL
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            removePostFromLocalStorage(postId);
            removePostFromDOM(postId);

        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    function removePostFromLocalStorage(postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }

    function removePostFromDOM(postId) {
        const postElement = document.querySelector(`.post-title[data-id="${postId}"]`).closest('.post-box');
        if (postElement) {
            postElement.remove();
        }
    }

    async function editPost(postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const postToEdit = posts.find(post => post.id === postId);

        if (postToEdit) {
            editPostId.value = postToEdit.id;
            editPostTitle.value = postToEdit.title;
            editPostCategory.value = postToEdit.tag;
            editPostAuthor.value = postToEdit.author;
            editPostDescription.value = postToEdit.body;
            editPostImageInput.value = postToEdit.media;

            editPostModal.style.display = 'flex';
        }
    }

    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut');
        setTimeout(() => {
            postDetailModal.style.display = 'none';
            postDetailModal.classList.remove('fadeOut');
        }, 500);
    });

    closeEditModal.addEventListener('click', function () {
        editPostModal.classList.add('fadeOut');
        setTimeout(() => {
            editPostModal.style.display = 'none';
            editPostModal.classList.remove('fadeOut');
        }, 500);
    });
    

    editPostForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const postTitle = editPostTitle.value;
        const postCategory = editPostCategory.value;
        const postAuthor = editPostAuthor.value;
        const postDescription = editPostDescription.value;
        const postImageUrl = editPostImageInput.value;

        try {
            const user = load('user');
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}/${postId}`, { 
                method: 'PUT',
                body: JSON.stringify({
                    title: postTitle,
                    author: postAuthor,
                    body: postDescription,
                    tags: [postCategory],
                    media: {
                        url: postImageUrl,
                        alt: `${postTitle} image`
                    }
                })
            });

            const updatedPost = await response.json();

            if (!response.ok) {
                throw new Error(updatedPost.message || 'Failed to update post');
            }

            updatePostInLocalStorage(updatedPost);
            updatePostInDOM(updatedPost);

            editPostModal.style.display = 'none';
        } catch (error) {
            console.error('Error updating post:', error);
        }
    });

    function updatePostInLocalStorage(updatedPost) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = posts.map(post =>
            post.id === updatedPost.id ? updatedPost : post
        );
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }

    function updatePostInDOM(updatedPost) {
        const postElement = document.querySelector(`.post-title[data-id="${updatedPost.id}"]`).closest('.post-box');
        if (postElement) {
            postElement.querySelector('.post-title').textContent = updatedPost.title;
            postElement.querySelector('.post-title').setAttribute('data-title', updatedPost.title);
            postElement.querySelector('.post-title').setAttribute('data-date', updatedPost.date);
            postElement.querySelector('.post-title').setAttribute('data-description', updatedPost.body);
            postElement.querySelector('.post-title').setAttribute('data-author', updatedPost.author);
            postElement.querySelector('.category').textContent = updatedPost.tag;
            postElement.querySelector('.author').textContent = updatedPost.author;
            postElement.querySelector('.post-date').textContent = updatedPost.date;
            postElement.querySelector('.post-description').textContent = updatedPost.body + '...';
        }
    }

    
    await loadPosts();

    
});





