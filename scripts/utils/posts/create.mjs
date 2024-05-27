import { API_BASE_URL } from "../../constants.mjs";
import { doFetch } from "../doFetch.mjs";

const action = "blog/posts";
const method = "post";

export async function newPost(postData) {
    const createPostURL = `${API_BASE_URL}${action}`;
    const token = load("token");

    try {
        const response = await doFetch(createPostURL, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`
            },
            method,
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('error', errorData);
            return;
        }

        const responseData = await response.json();
        console.log('Post created successfully:', responseData);
    } catch (error) {
        console.error('error:', error);
    }
    
}
