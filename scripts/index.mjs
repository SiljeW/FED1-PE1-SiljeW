import { doFetch } from "./utils/doFetch.mjs";
import { load } from "./utils/storage/index.mjs";
import { getBlogPostUrl } from "./constants.mjs";


document.addEventListener('DOMContentLoaded', async function () {
    const carouselContainer = document.getElementById('item-list');
    const blogArchiveContainer = document.getElementById('blog-archive-items');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const postDetailModal = document.getElementById('postDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailAuthor = document.getElementById('detailAuthor');
    const detailDate = document.getElementById('detailDate');
    const detailImage = document.getElementById('detailImage');
    const detailDescription = document.getElementById('detailDescription');
    const readMoreBtn = document.getElementById('readMore');

    let currentIndex = 0;
    let posts = [];

    function fetchPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach(post => {
            displayPostDetails(post);
        });
        return JSON.parse(localStorage.getItem('posts')) || [];
    }


    function displayPostDetails(post) {
        detailTitle.textContent = post.title;
        detailAuthor.textContent = post.author;
        detailDate.textContent = post.date;
        detailImage.src = post.media;
        detailDescription.textContent = post.body;
    }

    function closeModal() {
        postDetailModal.style.display = 'none';
    }

    readMoreBtn.addEventListener('click', closeModal);

    function createPostElement(post) {
        const postElement = document.createElement('div');
        postElement.className = 'carousel-item';
        postElement.innerHTML = `
            <h3 class="post-title" data-id="${post.id}">${post.title}</h3>
            <p class="post-author">${post.author}</p>
            <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
            <img src="${post.media}" alt="${post.media}" class="post-image">
            <p class="post-body">${post.body}</p>
        `;
        postElement.addEventListener('click', () => displayPostDetails(post));
        return postElement;
    }

    function displayCarouselPosts() {
        carouselContainer.innerHTML = '';
        const latestPosts = posts.slice(0, 3);
        latestPosts.forEach(post => {
            const postElement = createPostElement(post);
            carouselContainer.appendChild(postElement);
        });
    }

    function displayThumbnailPosts(startIndex, count) {
        const endIndex = startIndex + count;
        const postsToShow = posts.slice(startIndex, endIndex);
        postsToShow.forEach(post => {
            const postElement = createPostElement(post);
            blogArchiveContainer.appendChild(postElement);
        });
    }

    function rotateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? posts.length - 1 : currentIndex - 1;
        rotateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === posts.length - 1) ? 0 : currentIndex + 1;
        rotateCarousel();
    });

    loadMoreBtn.addEventListener('click', () => {
        const currentCount = blogArchiveContainer.childElementCount;
        displayThumbnailPosts(currentCount, 12);
    });

    function init() {
        posts = fetchPosts();
        displayCarouselPosts();
        displayThumbnailPosts(0, 12);
    }

    init();
});