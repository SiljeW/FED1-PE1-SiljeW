import { API_BASE_URL, API_BLOGPOSTS_URL } from "../../constants.mjs";
import { authFetch } from "../authFetch.mjs";
import { doFetch } from "../doFetch.mjs";


const method = "put";


export async function updatePost(postData) {
    const userJSON = localStorage.getItem('user');
    if (!postData.id) {
        throw new Error('Update requires a postID');
    }
    const user = JSON.parse(userJSON)
    const updatePostURL = `${API_BLOGPOSTS_URL}${user.name}/${postData.id}`;

    const response = await authFetch(updatePostURL, {
        method,
        body: JSON.stringify(postData)
    })

    return await response.JSON();
    
}
