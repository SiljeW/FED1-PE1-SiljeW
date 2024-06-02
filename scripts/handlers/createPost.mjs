import { createPost } from "../utils/posts/index.mjs";
export function setCreatePostFormListener() {
    const form = document.getElementById('postForm');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target;
            const formData = new FormData(form);
            const post = Object.fromEntries(formData.entries())
    
            createPost(post)
        })
    }
}