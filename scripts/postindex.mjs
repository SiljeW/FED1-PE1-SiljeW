import { API_BLOGPOSTS_URL } from "./constants.mjs";
import { authFetch } from "./utils/authFetch.mjs";
import { getAllPosts } from "./utils/posts/read.mjs";

document.addEventListener('DOMContentLoaded', async function () {
    const carouselContainer = document.getElementById('item-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const postDetailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailAuthor = document.getElementById('detailAuthor');
    const detailDate = document.getElementById('detailDate');
    const detailImage = document.getElementById('detailImage');
    const detailDescription = document.getElementById('detailDescription');

    let currentPostIndex = 0;
    let posts = [];

    async function getAllPosts(id) {
        try {
            const response = await authFetch(API_BLOGPOSTS_URL);
            const data = await response.json();
            posts = data.posts;
            displayPosts();

        }catch (error) { 
            console.error('Error getching posts:', error);
        }
    }

    carouselContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('post-title')) {
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
    })

    function displayPosts() { 
        carouselContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'carousel-item';
            postElement.innerHTML = `
            <h3 class="post-title" data-id="${post.id}">${post.title}</h3>
                <p class="post-author">${post.author}</p>
                <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
                <img src="${post.media.url}" alt="${post.media.alt}" class="post-image">
                <p class="post-description">${post.body}</p>
            `;
            postElement.addEventListener('click', () => showPostDetails(post));
            carouselContainer.appendChild(postElement);
            
        });
    }

    function showPostDetails(post) {
        detailTitle.textContent = post.title;
        detailAuthor.textContent = post.author;
        detailDate.textContent = new Date(post.date).toLocaleDateString();
        detailImage.src = post.media.url;
        detailImage.alt = post.media.alt;
        detailDescription.textContent = post.body;
        postDetailModal.style.display = 'flex';

    }

    closeDetailModal.addEventListener('click', () => {
        postDetailModal.style.display = 'none';
    });

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.style.display = index === currentPostIndex? 'block' : 'none';
        });
    }

    prevBtn.addEventListener('click', () => {
        currentPostIndex = (currentPostIndex - 1) % posts.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentPostIndex = (currentPostIndex + 1) % posts.length;
        updateCarousel();
    });

    await getAllPosts();
    updateCarousel();

})