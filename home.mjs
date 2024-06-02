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

        try {
            const response = await createPost(postData);
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

    async function updatePost(postId, postCategory, postTitle, postAuthor, postDescription, postImageUrl) {
        const postData = {
            title: postTitle,
            body: postDescription,
            tags: [postCategory],
            media: {
                url: postImageUrl || 'https://picsum.photos/id/108/2000/1333',
                alt: `${postTitle} image`
            }
        };

        try {
            const response = await fetch(`${API_BLOGPOSTS_URL}/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const updatedPosts = JSON.parse(localStorage.getItem('posts')) || [];
            const postIndex = updatedPosts.findIndex(post => post.id === postId);

            if (postIndex > -1) {
                const post = updatedPosts[postIndex];
                post.tag = postCategory;
                post.title = postTitle;
                post.author = postAuthor;
                post.body = postDescription;
                post.media = postImageUrl;

                savePosts(updatedPosts);
                refreshPosts();

                editPostModal.style.display = 'none';
                editPostForm.reset();
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
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

    function refreshPosts() {
        postContainer.innerHTML = '';
        loadPosts();
    }

    function deletePostFromLocalStorage(postId) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const updatedPosts = posts.filter(post => post.id !== postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
    }

    editPostForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const postId = editPostId.value;
        const postCategory = editPostCategory.value;
        const postTitle = editPostTitle.value;
        const postAuthor = editPostAuthor.value;
        const postDescription = editPostDescription.value;

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
            const updatedPost = posts[postIndex];
            updatedPost.category = postCategory;
            updatedPost.title = postTitle;
            updatedPost.author = postAuthor;
            updatedPost.description = postDescription;

            if (editPostImageInput.files && editPostImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    updatedPost.image = e.target.result;
                    savePosts(posts);
                    location.reload();
                };
                reader.readAsDataURL(editPostImageInput.files[0]);
            } else {
                updatePost(postId, postCategory, postTitle, postAuthor, postDescription);
                savePosts(posts);
                location.reload();
            }
        }

        editPostModal.style.display = 'none';
    });

    
    

    function addPostToDOM(postData, date, author) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-id="${postData.Id}"
                data-title="${postData.title}"
                data-date="${date}"
                data-description="${postData.body}">
                ${postData.title}
            </h1><br>
            <h2 class="category">${postData.tags}</h2><br>
            <h3 class="author">${author}</h3><br>
            <span class="post-date">${date}</span>
            <p class="post-description">
                ${postData.body}...</p>
            <button class="edit-post btn-style" data-id="${postData.id}">Edit</button>
            <button class="delete-post" data-id="${postData.id}">Delete</button>
            <span class="load-more" data-id="${postData.id}"
                data-title="${postData.title}"
                data-date="${date}"
                data-description="${postData.body}">
                Load more
            </span>
        `;
        postContainer.insertBefore(newPost, postContainer.firstChild);
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
            const titleToDelete = event.target.getAttribute('data-title');
            const postToDelete = document.querySelector(`.post-title[data-title="${titleToDelete}"]`).closest('.post-box');

            postToDelete.classList.add('fadeOut');

            setTimeout(() => {
                postContainer.removeChild(postToDelete);
            }, 500);
        }

        if (event.target.classList.contains('edit-post')) {
            const titleToEdit = event.target.getAttribute('data-title');
            const postToEdit = document.querySelector(`.post-title[data-title="${titleToEdit}"]`).closest('.post-box');


            editPostId.value = postToEdit.getAttribute('data-id');
            editPostCategory.value = postToEdit.getAttribute('data-category');
            editPostTitle.value = postToEdit.getAttribute('data-title');
            editPostAuthor.value = postToEdit.getAttribute('data-author');
            editPostDescription.value = postToEdit.getAttribute('data-description');

            editPostModal.style.display = 'flex';
        }
    });


    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut');
        setTimeout(() => {
            postDetailModal.style.display = 'none';
            postDetailModal.classList.remove('fadeOut');
        }, 500);
    });

    closeEditModal.addEventListener('click', function () {
        editPostModal.style.display = 'none';
    });

    
    
    
    await loadPosts();

    
});





