import { API_BASE_URL } from "./scripts/constants.mjs";
import { authFetch } from "./scripts/utils/authFetch.mjs";
import { doFetch } from "./scripts/utils/doFetch.mjs";
import { createPost } from "./scripts/utils/posts/create.mjs";
import { updatePost } from "./scripts/utils/posts/update.mjs";
import { load } from "./scripts/utils/storage/index.mjs";

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

    const action = '/blog/posts';

    async function createPost(postData) {
        const userJSON = localStorage.getItem('user');
        console.log(userJSON)
        if (!userJSON) {
            console.error('not logged in')
        }
        const user = JSON.parse(userJSON)
        
        const createPostURL = `${API_BASE_URL}${action}/stor`;
    
        try {
            const response = await authFetch(createPostURL, {
                method: 'POST',
                body: JSON.stringify(postData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('error', errorData);
                return;
            }
    
            const responseData = await response.json();
            console.log('Post created successfully:', responseData);
        } catch (error) {
            console.error('error:', error);
        }
        
    }

    function createAndSavePost(postCategory, postTitle, postAuthor, postDescription, postImageUrl) {
        const currentDate = new Date();
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

        createPost(postData).then((responseData) => {
            if (responseData) {
                addPostToDOM(responseData, formattedDate, postAuthor);
            }
        });

        createPostModal.style.display = 'none';
        postForm.reset();
    }

    function displayPost(postData) {
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
                <h1 class="post-title" data-id="${postData.id}"
                data-title="${postData.title}"
                data-date="${postData.date}"
                data-description="${postData.body}">
                ${postData.title}
            </h1><br>
            <h2 class="category">${postData.tags}</h2><br>
            <h3 class="author">${postData.author}</h3><br>
            <span class="post-date">${postData.date}</span>
            <p class="post-description">
                ${postData.body}...</p>
            <button class="edit-post btn-style" data-id="${postData.id}">Edit</button>
            <button class="delete-post" data-id="${postData.id}">Delete</button>
            <span class="load-more" data-id="${postData.id}"
                data-title="${postData.title}"
                data-date="${postData.date}"
                data-description="${postData.body}">
                Load more
            </span>
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
        
        
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;

        const postId = generateID();

        const newPost = {
            title: 'My new post',
            body: 'This is the body of the post',
            tags: ['tag1', 'tag2'],
            media: {
                url: 'https://url.com/image.jpg',
                alt: 'An image description'
            }
        };

        if (postImageInput.files && postImageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                newPost.image = e.target.result;

                const posts = JSON.parse(localStorage.getItem('posts')) || [];
                posts.push(newPost);
                savePosts(posts);
                savePost({
                    title: postTitle,
                    body: postDescription,
                    media: {url: e.target.result, alt: ""}

                })

                displayPost(newPost);

                const postCreatedMessage = document.getElementById('postCreatedMessage');
                postCreatedMessage.style.display = 'block';

                postForm.reset();

                setTimeout(() => {
                    postCreatedMessage.style.display = 'none';
                }, 3000);
            };
            reader.readAsDataURL(postImageInput.files[0]);
        } else {
            savePost({
                title: postTitle,
                body: postDescription,

            })
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            posts.push(newPost);
            savePosts(posts);

            displayPost(newPost);

            const postCreatedMessage = document.getElementById('postCreatedMessage');
            postCreatedMessage.style.display = 'block';

            postForm.reset();

            setTimeout(() => {
                postCreatedMessage.style.display = 'none';
            }, 3000);
        }
    });

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






