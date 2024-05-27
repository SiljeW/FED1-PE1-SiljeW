import { API_BASE_URL } from "../constants.mjs";
import { doFetch } from "../utils/doFetch.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log('register');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        

        if (localStorage.getItem(email)) {
            showMessage('email already exists.');
            console.log(localStorage.getItem(email));
            return;
        }
        
        const response = await doFetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        console.log(response);

        if (!response.data) {
            showMessage('Registration failed.');
            return;
        }

        localStorage.setItem(email, JSON.stringify({ name, email, password }));
        localStorage.setItem("user", JSON.stringify({ name, email, accessToken: response.data.accessToken }));

        showMessage('Registration successful. You can now log in.', false);
        setTimeout(() => {
            window.location.href = '/account/login'
        }, 1000);
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

    




