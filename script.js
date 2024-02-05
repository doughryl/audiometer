document.addEventListener('DOMContentLoaded', function () {
    const formContainer = document.querySelector('.form_container');
    const loginForm = document.querySelector('.login_form');
    const signupForm = document.querySelector('.signup_form');

    const registrationSuccessMessage = document.getElementById('registration-success-message');
    const passwordMismatchMessage = document.getElementById('password-mismatch-message');
    const emailTakenMessage = document.getElementById('email-taken-message');
    const incorrectPasswordMessage = document.getElementById('incorrect-password-message');
    const loginFailedMessage = document.getElementById('login-failed-message');

    const urlParams = new URLSearchParams(window.location.search);
    const emailTakenParam = urlParams.get('emailTaken');
    const incorrectPasswordParam = urlParams.get('incorrectPassword');
    const loginFailedParam = urlParams.get('loginFailed');
    const registrationSuccessParam = urlParams.get('registrationSuccess');
    

    function hideMessages() {
        registrationSuccessMessage.style.display = 'none';
        passwordMismatchMessage.style.display = 'none';
        emailTakenMessage.style.display = 'none';
        incorrectPasswordMessage.style.display = 'none';
        loginFailedMessage.style.display = 'none';
    }

    hideMessages();

    if (emailTakenParam === 'true') {
        emailTakenMessage.style.display = 'block';
        showSignupForm();
    } else if (incorrectPasswordParam === 'true') {
        incorrectPasswordMessage.style.display = 'block';
        showLoginForm();
    } else if (loginFailedParam === 'true') {
        loginFailedMessage.style.display = 'block';
        showLoginForm();
    } else if (registrationSuccessParam === 'true') {
        showLoginForm();
        registrationSuccessMessage.style.display = 'block';
    } else if (window.location.hash === "#signup_form") {
        showSignupForm();
        passwordMismatchMessage.style.display = 'block';
    }

    function hideForm() {
        formContainer.style.display = 'none';
        window.location.hash = '';
        hideMessages();
        window.history.replaceState({}, document.title, 'index.html');
    }

    function showLoginForm() {
        formContainer.style.display = 'block';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }

    function showSignupForm() {
        formContainer.style.display = 'block';
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }

    document.getElementById('form-open').addEventListener('click', function () {
        if (formContainer.style.display === 'none' || formContainer.style.display === '') {
            showLoginForm();
        } else {
            hideForm();
        }
    });

    document.querySelectorAll('.form_close').forEach(function (closeButton) {
        closeButton.addEventListener('click', hideForm);
    });

    document.getElementById('signup').addEventListener('click', function () {
        showSignupForm();
    });

    document.getElementById('login').addEventListener('click', function () {
        showLoginForm();
    });

    // function to show the forms
    window.showLoginForm = showLoginForm;
    window.showSignupForm = showSignupForm;

     
  var mybutton = document.getElementById("backToTopBtn");

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 500 ||
      document.documentElement.scrollTop > 500
    ) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  mybutton.addEventListener("click", function () {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
  });
});
