import { API_BASE_URL } from "../constants.mjs";
import { authFetch } from "../utils/authFetch.mjs";
import * as storage from "../utils/storage/index.mjs"

const action = 'auth/login'
const method = 'post'

export async function login(profile) {
    const loginURL = `${API_BASE_URL}${action}`
    const body = JSON.stringify(profile);

    const response = await authFetch(loginURL, {
        method,
        body
    })

    const { accessToken, ...user } = await response.JSON()
    
    localStorage.setItem('token', result.accessToken);

    storage.save('token', accessToken)

    storage.save('profile', user)

    alert ("You are now logged in")

}