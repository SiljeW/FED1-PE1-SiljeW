import { API_BASE_URL } from "../constants.mjs";
import { doFetch } from "./doFetch.mjs";

export async function login({ email, password }) {
    const loginURL = `${API_BASE_URL}/auth/login`;
    const body = JSON.stringify({ email, password });

    const response = await doFetch(loginURL, {
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        body

    })
    const result = await response.json()
    
    
    localStorage.setItem("token", result.accessToken);

}

