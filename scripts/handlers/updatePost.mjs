import { updatePost } from "../utils/posts/index.mjs";
export async function setUpdatePostFormListener() {
    const form = document.getElementById('editPostModal');

    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');

    if (form) {
        const button = form.querySelector('button[type="submit"]');
        button.disabled = true;

        const post = await getPost(id);

        form.title.valueOf = post.title;
        form.body.value = post.body;
        form.tags.value = post.tags;
        form.media.value = post.media;

        button.disabled = false;

        form.addEventListener('submit', (event) => {
            event.preventDefault()
            const form = event.target;
            const formData = new FormData(form);
            const post = Object.fromEntries(formData.entries())
            post.id = id;
    
            updatePost(post)
        })
    }
}