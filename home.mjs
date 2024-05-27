import { API_BASE_URL } from "./scripts/constants.mjs";
import { doFetch } from "./scripts/utils/doFetch.mjs";
import { newPost } from "./scripts/utils/posts/create.mjs";
import { read } from "./scripts/utils/posts/read.mjs";

document.addEventListener('DOMContentLoaded', function () {
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
    const postImageInput = document.getElementById('postImage');
    const blogImageLabel = document.querySelector('.blogimage');

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

    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            displayPost(post);
        });
    }

    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function displayPost(post) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
            <h1 class="post-title" data-id="${post.id}" data-title="${post.title}" data-date="${post.date}" data-description="${post.description}" data-author="${post.author}" data-image="${post.image}">
                ${post.title}
            </h1>
            <h2 class="category">${post.category}</h2>
            <h3 class="author">${post.author}</h3>
            <span class="post-date">${post.date}</span>
            <p class="post-description">${post.description.substring(0, 100)}...</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            <button class="delete-post" data-id="${post.id}">Delete</button>
            <span class="load-more" data-id="${post.id}">Load more</span>
            <button class="edit-post" data-id="${post.id}">Edit</button>
        `;

        postContainer.insertBefore(newPost, postContainer.firstChild);
    }

    async function savePost(post) {
        const userJSON = localStorage.getItem('user');
        console.log(userJSON)
        if (!userJSON) {
            console.error('not logged in')
        }
        const user = JSON.parse(userJSON)
        const response = await doFetch(`${API_BASE_URL}/blog/posts/sil_wal`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            },
            method: 'POST',
            body: JSON.stringify(post),
        });

        console.log(response);
    }

    postForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const postCategory = document.getElementById('postCategory').value;
        const postTitle = document.getElementById('postTitle').value;
        const postAuthor = document.getElementById('postAuthor').value;
        const postDescription = document.getElementById('postDescription').value;
        const postImageInput = document.getElementById('postImage');

        if (postCategory.trim() === '' || 
            postTitle.trim() === '' || 
            postAuthor.trim() === '' || 
            postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }
        
        let postImageUrl = '';
        if (postImageUrl.files && postImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                postImageUrl = e.target.result;
                createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl);
            };
            reader.readAsDataURL(postImageInput.files[0]);
        } else {
            createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl);
        }
    });

    function createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl) {
        createAndSavePost = new Date();
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        const postData = {
            title: postTitle,
            body: postDescription,
            tags: [postCategory],
            media: {
                url: postImageUrl,
                alt: `${postTitle} image`
            }
        };

        createPostBtn(postData).then()
    }

    postImageInput.addEventListener('change', function () {
        if (postImageInput.files && postImageInput.files[0]) {
            blogImageLabel.textContent = postImageInput.files[0].name;
        } else {
            blogImageLabel.textContent = 'Upload image';
        }
    });

    postContainer.addEventListener('click', function (event) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        if (event.target.classList.contains('load-more') || event.target.classList.contains('post-title')) {
            const postId = event.target.getAttribute('data-id');
            const post = posts.find(p => p.id === postId);

            if (post) {
                detailTitle.textContent = post.title;
                detailAuthor.textContent = post.author;
                detailDate.textContent = post.date;
                detailDescription.textContent = post.description;
                if (post.image) {
                    detailImage.src = post.image;
                    detailImage.style.display = 'block';
                } else {
                    detailImage.style.display = 'none';
                }

                postDetailModal.style.display = 'flex';
            }
        }

        if (event.target.classList.contains('delete-post')) {
            const postId = event.target.getAttribute('data-id');
            const updatedPosts = posts.filter(post => post.id !== postId);
            savePosts(updatedPosts);

            const postToDelete = document.querySelector(`.post-title[data-id="${postId}"]`).closest('.post-box');
            postToDelete.classList.add('fadeOut');

            setTimeout(() => {
                postContainer.removeChild(postToDelete);
            }, 500);
        }

        if (event.target.classList.contains('edit-post')) {
            const postId = event.target.getAttribute('data-id');
            const post = posts.find(p => p.id === postId);

            if (post) {
                editPostId.value = post.id;
                editPostCategory.value = post.category;
                editPostTitle.value = post.title;
                editPostAuthor.value = post.author;
                editPostDescription.value = post.description;

                editPostModal.style.display = 'flex';
            }
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
                savePosts(posts);
                location.reload();
            }
        }

        editPostModal.style.display = 'none';
    });

    loadPosts();
});






