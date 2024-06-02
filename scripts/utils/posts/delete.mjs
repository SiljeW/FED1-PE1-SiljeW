import { API_BASE_URL, API_BLOGPOSTS_URL } from "../../constants.mjs";
import { authFetch } from "../authFetch.mjs";
import { doFetch } from "../doFetch.mjs";


const method = "delete";


export async function removePost(id) {
    const userJSON = localStorage.getItem('user');
    if(!id) {
        throw new Error('Delete requires a postID');
    }

    const user = JSON.parse(userJSON)

    const updatePostURL = `${API_BLOGPOSTS_URL}/${user.name}/${id}`;
    
    const response = await authFetch(updatePostURL, {
        method
    })

    return await response.json();
    
}
