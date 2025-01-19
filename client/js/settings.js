document.addEventListener('DOMContentLoaded', () => {
  const editProfileForm = document.getElementById('edit-profile-form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    usernameInput.value = currentUser.username;
    emailInput.value = currentUser.email;
  }

  editProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
      currentUsername: currentUser.username,
      username: usernameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    try {
      const response = await fetch('/settings/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        sessionStorage.setItem('currentUser', JSON.stringify({ username: updatedData.username, email: updatedData.email }));
        window.location.href = '/profile';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  });
});


// document.addEventListener('DOMContentLoaded', () => {
//     const deactivateBtn = document.getElementById('deactivate-btn');
//     const modal = document.getElementById('deactivate-modal');
//     const confirmDeactivateBtn = document.getElementById('confirm-deactivate-btn');
//     const cancelDeactivateModalBtn = document.getElementById('cancel-deactivate-modal-btn');
  
//     // Show modal on "Deactivate Account" button click
//     deactivateBtn.addEventListener('click', () => {
//       modal.classList.remove('hidden');
//     });
  
//     // Confirm deactivation
//     confirmDeactivateBtn.addEventListener('click', () => {
//       fetch('/profile/delete', {
//         method: 'DELETE',
//       })
//         .then(response => response.json())
//         .then(data => {
//           alert(data.message || 'Account deactivated successfully');
//           window.location.href = '/logout';
//         })
//         .catch(error => console.error('Error deactivating account:', error));
//     });
  
//     // Cancel deactivation and close modal
//     cancelDeactivateModalBtn.addEventListener('click', () => {
//       modal.classList.add('hidden');
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
  const homeBtn = document.getElementById('home-btn');

  homeBtn.addEventListener('click', () => {
    window.location.href = '/profile';
  });
});
  