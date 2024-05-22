import { API_BLOGPOSTS_URL } from "./constants.mjs";
import { doFetch } from "./utils/doFetch.mjs";



document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (localStorage.getItem(username)) {
            showMessage('Username already exists.');
        } else {
            localStorage.setItem(username, JSON.stringify({ name, username, password}));
            showMessage('Registration successful. You can now log in.', false);
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = JSON.parse(localStorage.getItem(username));

        if (user && user.password === password) {
            showMessage('Login successful!', false);
            setTimeout(() => {
                window.location.href = '../post/index.html'
            }, 1000);
        } else {
            showMessage('Invalid username or password.');
        }
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
});

async function main() {
    const responseData = await doFetch(API_BLOGPOSTS_URL);
    const blogposts = responseData.data;
    displayBlogposts(blogposts);
}
main();