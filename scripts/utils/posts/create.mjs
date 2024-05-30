import { API_BASE_URL } from "../../constants.mjs";
import { authFetch } from "../authFetch.mjs";

const action = "blog/posts";
const method = "post";

export async function createPost(postData) {
    const createPostURL = `${API_BASE_URL}${action}/users?name=${username}`;

    const response = await authFetch(createPostURL, {
        method,
        body: JSON.stringify(postData)
    });
}

