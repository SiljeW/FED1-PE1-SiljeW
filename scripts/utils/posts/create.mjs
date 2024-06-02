import { API_BASE_URL, API_BLOGPOSTS_URL } from "../../constants.mjs";
import { authFetch } from "../authFetch.mjs";
import { doFetch } from "../doFetch.mjs";


const method = "post";

export async function createPost(postData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const createPostURL = `${API_BLOGPOSTS_URL}/${user.name}`;

    const response = await authFetch(createPostURL, {
        method,
        body: JSON.stringify(postData)
    });

    const post = await response.json();

    return post
}

