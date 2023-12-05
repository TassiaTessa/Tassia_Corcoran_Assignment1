// login.js
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);

    // Set error message if present
    const errorMessageElement = document.getElementById('errorMessage');
    if (params.has('loginError')) {
        errorMessageElement.innerText = params.get('loginError');
    }

    // Set email value if present
    const emailInput = document.getElementById('email');
    if (params.has('email')) {
        emailInput.value = params.get('email');
    }

    // Get references to the password input and the show password checkbox
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showPasswordCheckbox');

    // Add an event listener to the checkbox to toggle password visibility
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
});
