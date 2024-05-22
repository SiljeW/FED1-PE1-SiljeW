import { API_BLOGPOSTS_URL } from "./scripts/constants.mjs";
import { doFetch } from "./scripts/utils/doFetch.mjs";

document.addEventListener('DOMContentLoaded', function () {
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const postForm = document.getElementById('postForm');
    const postSubmitBtn = document.getElementById('postSubmitBtn')
    const postContainer = document.querySelector('.post-container');
    const postDetailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailDate = document.getElementById('detailDate');
    const detailDescription = document.getElementById('detailDescription');

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

    postForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const postCategory = document.getElementById('postCategory').value;
        const postTitle = document.getElementById('postTitle').value;
        const postAuthor = document.getElementById('postAuthor').value;
        const postDescription = document.getElementById('postDescription').value;

        if (postCategory.trim()=== '' || 
        postTitle.trim() === '' ||
        postAuthor.trim() === '' ||
        postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }

        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default',
        { month: 'short' });
        const year = currentDate.getFullYear();
        const formattedDate = day + '' + month + '' + year;

        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        newPost.innerHTML = `
        <h1 class="post-title" data-title="${postTitle}"
        data-date="${formattedDate}"
        data-description="${postDescription}">
        ${postTitle}</h1><br>

        <h2 class="category">${postCategory}</h2><br>
        <h3 class="author">${postAuthor}</h3><br>
        <span class="post-date">${formattedDate}</span>
        <p class="post-description">
        ${postDescription.substring(0, 100)}...</p>
        <button class="delete-post" data-title="${postTitle}>
        Delete</button>
        <span class="load-more" data-title="${postTitle}"
        data-date="${formattedDate}"
        data-description="${postDescription}">
        Load more</span>
        `;

        postContainer.insertBefore(newPost, postContainer.firstChild);

        const postCreatedMessage = document.getElementById('postCreatedMessage');
        postCreatedMessage.style.display = 'block';

        createPostModal.style.display = 'none';

        postForm.reset();

        setTimeout(() => {
            postCreatedMessage.style.display = 'none';
        }, 3000);
    });

    postContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('load-more') ||
        event.target.classList.contains('post-title')) {
            const title = event.target.getAttribute('data-title');
            const date = event.target.getAttribute('data-date');
            const description = event.target.getAttribute('data-description');

            detailTitle.textContent = title;
            detailDate.textContent = date;
            detailDescription.textContent = description;

            postDetailModal.style.display = 'flex';
        }

        if (EventCounts.target.classList.contains('delete-post')) {
            const titleToDelete =
            event.target.getAttribute('data-title');
            const postToDelete = document.querySelector(`
            .post-title[data-title="${titleToDelete}"]`).closest('.post-box');

            postToDelete.classList.add('fadeOut');

            setTimeout(() => {
                postContainer.removerChild(postToDelete);
            }, 500);
        }
    });

    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut');
        setTimeout (() => {
            postDetailModal.style.display = 'none';
            postDetailModal.classList.remove('fadeOut');
        }, 500);
    });
});

function generateBlogpostHtml(blogpost) {
    const blogpostWrapper = document.createElement('div');
    blogpostWrapper.classList.add('blogpost-wrapper');

    const blogpostContainer = document.createElement('div');
    blogpostContainer.classList.add('blogpost-container');
    blogpostContainer.addEventListener('click', () => {
        showBlogpostDetails(blogpost);
    });
}

function displayBlogposts (blogposts) {
    console.log(blogposts);
    blogposts.forEach((blogpost) => {
        const blogpostHtml = generateBlogpostHtml(blogpost)
    });
}

async function main() {
    const responseData = await doFetch(API_BLOGPOSTS_URL);
    const blogposts = responseData.data;
    displayBlogposts(blogposts);
}

main();

