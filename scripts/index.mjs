import { doFetch } from "./utils/doFetch.mjs";
import { load } from "./utils/storage/index.mjs";
import { API_BLOGPOSTS_URL } from "./constants.mjs";
import { authFetch } from "./utils/authFetch.mjs";

document.addEventListener('DOMContentLoaded', async function () {
    const carouselContainer = document.getElementById('item-list');
    const archiveContainer = document.getElementById('blog-archive-items');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentIndex = 0;
    const itemsToShow = 1;

    async function fetchPosts() {
        const user = load('user');
        try {
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}`);
            const data = await response.json();
            return data.data; 
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    function displayPosts(posts) {
        carouselContainer.innerHTML = '';
        archiveContainer.innerHTML = '';

        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'carousel-item';
            postElement.innerHTML = `
                <h3 class="post-title" data-id="${post.id}">${post.title}</h3>
                <p class="post-author">by ${post.author.name}</p>
                <span class="post-date">Published ${new Date(post.created).toLocaleDateString()}</span>
                <img src="${post.media?.url || 'default-image-url.jpg'}" alt="${post.media?.alt || 'Post image'}" class="post-image">
                <p class="post-description">${post.body}</p>
                <span class="read-more" data-id="${post.id}">Read more</span>
            `;
            postElement.addEventListener('click', () => openPostDetail(post.id));
            carouselContainer.appendChild(postElement);
        });

        posts.slice(0, 12).forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'archive-item';
            postElement.innerHTML = `
                <h3 class="post-title" data-id="${post.id}">${post.title}</h3>
                <p class="post-author">by ${post.author.name}</p>
                <img src="${post.media?.url || 'default-image-url.jpg'}" alt="${post.media?.alt || 'Post image'}" class="post-image">
                <span class="post-date">Published ${new Date(post.created).toLocaleDateString()}</span>
            `;
            postElement.addEventListener('click', () => openPostDetail(post.id));
            archiveContainer.appendChild(postElement);
        });
    }

    function openPostDetail(postId) {
        window.location.href = `post/index.html?id=${postId}`;
    }

    function updateCarousel(posts) {
        const carouselItems = carouselContainer.getElementsByClassName('carousel-item');
        const totalItems = carouselItems.length;

        Array.from(carouselItems).forEach((item, index) => {
            item.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
    }

    function addCarouselNavigation(posts) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + posts.length) % posts.length;
            updateCarousel(posts);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % posts.length;
            updateCarousel(posts);
        });

        updateCarousel(posts);
    }

    async function init() {
        const posts = await fetchPosts();
        displayPosts(posts);
        addCarouselNavigation(posts);
    }

    init();
});