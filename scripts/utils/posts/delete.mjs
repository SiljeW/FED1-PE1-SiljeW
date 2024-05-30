import { API_BASE_URL } from "../../constants.mjs";
import { doFetch } from "../doFetch.mjs";


const action = "blog/posts";
const method = "delete";

export async function removePost(id) {
    if(!id) {
        throw new Error('Delete requires a postID');
    }

    const updatePostURL = `${API_BASE_URL}${action}/${id}`;
    
    const response = await doFetch(updatePostURL, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.accessToken}`
        },
        method,
    })

    return await response.json();
    
}
