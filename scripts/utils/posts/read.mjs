import { API_BASE_URL } from "../../constants.mjs";
import { doFetch } from "../doFetch.mjs";

const action = "blog/posts";
const method = "get";

export async function getPost(id) {
    if(!id) {
        throw new Error('Get requires a postID');
    }

    const getPostURL = `${API_BASE_URL}${action}/${id}`;
    
    const response = await doFetch(getPostURL)

    return await response.json();
}


export async function getPosts(postData) {

    const updatePostURL = `${API_BASE_URL}${action}`;
    
    const response = await doFetch(updatePostURL)

    return await response.json();   
}

