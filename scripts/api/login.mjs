import { API_BASE_URL } from "../constants.mjs";
import { doFetch } from "../utils/doFetch.mjs";
import * as storage from "../utils/storage/index.mjs"

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
    
        const user = await doFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }); 
    
        if (user?.data?.name) {
            showMessage('Login successful!', false);
            localStorage.setItem("user", JSON.stringify({ name: user.data.name, email, accessToken: user.data.accessToken }));
            setTimeout(() => {
                console.log(user)
                window.location.href = '/post'
            }, 1000);
        } else {
            showMessage('Invalid username or password.');
        }

        storage.save("token", result.accessToken)

        storage.save("user", user)
    });
    
    function showMessage(message, isError = true) {
        messageDiv.textContent = message;
        messageDiv.style.color = isError ? 'red' : 'green';
    }
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.dataset.placeholder = e.target.placeholder;
            e.target.placeholder = '';
        });
    
        input.addEventListener('blur', (e) => {
            e.target.placeholder = e.target.dataset.placeholder;
        });
    });
})





