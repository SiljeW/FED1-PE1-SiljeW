import { load } from "./storage/index.mjs";

export function headers() {
    const userJSON = localStorage.getItem('user');
        console.log(userJSON)
        if (!userJSON) {
            console.error('not logged in')
        }
        const user = JSON.parse(userJSON)

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`
    }
}

export async function authFetch(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: headers()
    })
}