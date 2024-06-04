
import { API_BLOGPOSTS_URL, getBlogPostUrl } from "./constants.mjs";
import { authFetch } from "./utils/authFetch.mjs";

document.addEventListener('DOMContentLoaded', async function () {
    const detailTitle = document.getElementById('detailTitle');
    const detailAuthor = document.getElementById('detailAuthor');
    const detailDate = document.getElementById('detailDate');
    const detailImage = document.getElementById('detailImage');
    const detailDescription = document.getElementById('detailDescription');
    const sharePostBtn = document.getElementById('sharePost');

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);

    if (postId && user) {
        try {
            const response = await authFetch(`${API_BLOGPOSTS_URL}/${user.name}/${postId}`);
            
            const data = await response.json();
            const post = data.data || data; 

            if (post) {
                detailTitle.textContent = post.title || 'No Title';
                detailAuthor.textContent = post.author?.name || 'Unknown Author';
                detailDate.textContent = new Date(post.created || post.updated || Date.now()).toLocaleDateString();
                detailImage.src = post.media?.url || 'default-image-url.jpg';
                detailImage.alt = post.media?.alt || 'Post Image';
                detailDescription.textContent = post.body || 'No Content';
            } else {
                detailTitle.textContent = 'Post not found';
                detailDescription.textContent = '';
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
            detailTitle.textContent = 'Error fetching post details';
            detailDescription.textContent = '';
        }
    } else {
        detailTitle.textContent = 'Post not found';
        detailDescription.textContent = '';
    }

    if (sharePostBtn) {
        sharePostBtn.addEventListener('click', function () {
            if (postId) {
                const shareUrl = `${window.location.origin}/post/index.html?id=${postId}`;
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('Shareable URL copied to clipboard!');
                }).catch(err => {
                    console.error('Error copying to clipboard:', err);
                });
            } else {
                alert('Unable to generate shareable URL.');
            }
        });
    }
});