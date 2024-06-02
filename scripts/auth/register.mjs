import { API_BASE_URL } from "../constants.mjs";
import { authFetch } from "../utils/authFetch.mjs";

const action = 'auth/register'
const method = 'post'


export async function register(profile) {
    const registerURL = `${API_BASE_URL}${action}`
    const body = JSON.stringify(profile);

    const response = await authFetch(registerURL, {
        method,
        body
    })

    const result = await response.JSON()
    return result
}