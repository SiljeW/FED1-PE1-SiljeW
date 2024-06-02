import { getPost } from "../utils/posts/index.mjs";
import { getAllPosts } from "../utils/posts/index.mjs";
export function setGetPostFormListener() {
    const form = document.getElementById('postDetailModal');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target;
            const formData = new FormData(form);
            const post = Object.fromEntries(formData.entries())
    
            getPost(post)
        })
    }
}

export function setGetAllPostsFormListener() {
    const form = document.getElementById('postDetailModal');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target;
            const formData = new FormData(form);
            const posts = Object.fromEntries(formData.entries())
    
            getAllPosts(posts)
        })
    }
}