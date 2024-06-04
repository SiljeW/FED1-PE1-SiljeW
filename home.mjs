import { API_BASE_URL, API_BLOGPOSTS_URL, getBlogPostUrl } from "./scripts/constants.mjs";
import { authFetch } from "./scripts/utils/authFetch.mjs";
import { doFetch } from "./scripts/utils/doFetch.mjs";
import { load } from "./scripts/utils/storage/index.mjs";

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

    function loadPostsFromLocalStorage() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            displayPost(post);
        });
    }

    function savePostToLocalStorage(post) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
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
            <img src="${post.media?.url || 'https://picsum.photos/id/101/2621/1747'}" alt="${post.media?.alt || 'Post image'}" class="post-image">
            <p class="post-description">${post.body}...</p>
            <button class="delete-post" data-id="${post.id}">Delete</button>
            <button class="edit-post" data-id="${post.id}">Edit</button>
            <span class="load-more" data-id="${post.id}">Load more</span>
            
        `;

        postContainer.insertBefore(newPost, postContainer.firstChild);
    }

    function displayPost(post) { 
        if (!document.querySelector(`.post-box[data-id="${post.id}"]`)) {
            addPostToDOM(post);
        }
    }

    async function loadPosts() {
        var user = load('user');
        
        if (user) {
            var response = await doFetch(getBlogPostUrl(user.name));
            const posts = response.data;
            posts.forEach(post => {
                savePostToLocalStorage(post);
                displayPost(post);
            });
        }
    }

    loadPostsFromLocalStorage();
    loadPosts();

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

        await createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl);
        
    });

    async function createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        const user = load('user');
        const postData = {
            title: postTitle,
            body: postDescription,
            date: formattedDate,
            tags: [postCategory],
            author: postAuthor,
            media: {
                url: 'https://picsum.photos/id/108/2000/1333',
                alt: `${postTitle} image`
            }
        };
        
        try {
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}`, {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create post');
            }

            const postId = responseData.data.id;
            const post = {
                id: postId,
                title: postTitle,
                body: postDescription,
                tag: postCategory,
                author: postAuthor,
                date: formattedDate,
                media: postImageUrl
            };
            console.log(responseData);

            savePostToLocalStorage(post);
            addPostToDOM(post);
        
        } catch (error) {
            console.error('Error creating post:', error)
        }

        createPostModal.style.display = 'none';
        postForm.reset();
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
            detailImage.

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
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}/${postId}`, { 
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
            editPostCategory.value = postToEdit.tag;
            editPostTitle.value = postToEdit.title;
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

        const postId = editPostId.value;
        const postCategory = editPostCategory.value;
        const postTitle = editPostTitle.value;
        const postAuthor = editPostAuthor.value;
        const postDescription = editPostDescription.value;
        const postImageUrl = editPostImageInput.value;


        try {
            var user = load('user');
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}/${postId}`, { 
                method: 'PUT',
                body: JSON.stringify({
                    title: postTitle,
                    body: postDescription,
                    tags: [postCategory],
                    author: postAuthor,
                    date: new Date().toISOString(),
                    media: {
                        url: postImageUrl,
                        alt: `${postTitle} image`
                    },
                    
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
            postElement.querySelector('.post-date').textContent = new Date(updatedPost.updated).toLocaleDateString();
            postElement.querySelector('.post-description').textContent = updatedPost.body + '...';
        }
    }

    

    
});





