import { API_BASE_URL, API_BLOGPOSTS_URL } from "../../constants.mjs";
import { authFetch } from "../authFetch.mjs";


export async function getPost(name, id) {
    if(!id) {
        throw new Error('Get requires a postID');
    }

    const userJSON = localStorage.getItem('user');
        console.log(userJSON)
        if (!userJSON) {
            console.error('not logged in')
        }
    const user = JSON.parse(userJSON)

    const getPostURL = `${API_BLOGPOSTS_URL}/${user.name}/${id}`;
    
    const response = await authFetch(getPostURL)

    const post = await getPost();
}


export async function getAllPosts(id) {
    if(!id) {
        throw new Error('Get requires a postID');
    }

    const updatePostURL = `${API_BLOGPOSTS_URL}/${id}`;
    
    const response = await authFetch(updatePostURL)
 
    const posts = await getAllPosts();
}

