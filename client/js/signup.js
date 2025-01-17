document.getElementById('signup-button').addEventListener('click', async function() {
    const username = document.querySelector('input[type="text"]').value;
    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!username || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/data/userDB.json');
        const data = await response.json();
        
        // Check if user already exists
        const userExists = data.users.some(user => user.email === email);
        if (userExists) {
            alert('User with this email already exists');
            return;
        }

        data.users.push({
            username,
            email,
            password
        });

        // Save updated data
        await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        alert('Signup successful!');
        window.location.href = '/client/html/login.html';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during signup');
    }
});