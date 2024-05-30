import { API_BASE_URL } from "../../constants.mjs";
import { doFetch } from "../doFetch.mjs";

const action = "blog/posts";
const method = "put";

export async function updatePost(postData) {
    if (!postData.id) {
        throw new Error('Update requires a postID');
    }
    const updatePostURL = `${API_BASE_URL}${action}/${postData.id}`;

    const response = await doFetch(updatePostURL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
        method,
        body: JSON.stringify(postData)
    })

    return await response.JSON();
    
}
