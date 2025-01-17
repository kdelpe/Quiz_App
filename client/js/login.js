
document.getElementById('login-button').addEventListener('click', async function() {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store user info in session storage
            sessionStorage.setItem('currentUser', JSON.stringify(data.user));
            alert('Login successful!');
            window.location.href = '/';
        } else {
            alert(data.error || 'Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
});



