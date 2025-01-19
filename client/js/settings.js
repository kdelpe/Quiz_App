document.addEventListener('DOMContentLoaded', () => {
  const editProfileForm = document.getElementById('edit-profile-form');
  const modal = document.getElementById('save-changes-modal');
  const confirmSaveBtn = document.getElementById('confirm-save-btn');
  const cancelSaveBtn = document.getElementById('cancel-save-btn');
  const backButton = document.getElementById('home-btn');
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const usernameField = document.getElementById('username');
  const emailField = document.getElementById('email');

  if (!currentUser) {
    alert('You are not logged in. Redirecting to login page...');
    window.location.href = '/login';
    return;
  }

  async function fetchUserProfile() {
    try {
      const response = await fetch(`/settings/get-profile?username=${encodeURIComponent(currentUser.username)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      usernameField.value = data.username;
      emailField.value = data.email;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      alert('Failed to load profile data.');
    }
  }

  fetchUserProfile();


  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
  });

  confirmSaveBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !email || !password) {
      alert('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/settings/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUsername: currentUser.username, username, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        sessionStorage.setItem('currentUser', JSON.stringify({ username, email }));
        window.location.href = '/profile';
      } else {
        alert(result.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    }
  });

  cancelSaveBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

    // Back button functionality
  backButton.addEventListener('click', () => {
    window.location.href = '/profile';
  });
});

//DELETE USER
document.addEventListener('DOMContentLoaded', () => {
  const deactivateBtn = document.getElementById('deactivate-btn');
  const confirmDeactivateBtn = document.getElementById('confirm-deactivate-btn');
  const cancelDeactivateModalBtn = document.getElementById('cancel-deactivate-modal-btn');
  const deactivateModal = document.getElementById('deactivate-modal');

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  if (!currentUser) {
    alert('You are not logged in. Redirecting to login page...');
    window.location.href = '/login';
    return;
  }

  deactivateBtn.addEventListener('click', () => {
    deactivateModal.classList.remove('hidden');
  });

  cancelDeactivateModalBtn.addEventListener('click', () => {
    deactivateModal.classList.add('hidden');
  });

  confirmDeactivateBtn.addEventListener('click', async () => {
    try {
      const response = await fetch('/settings/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser.username }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Account deactivated successfully.');
        sessionStorage.removeItem('currentUser');
        window.location.href = '/login';
      } else {
        alert(result.error || 'Failed to deactivate account.');
      }
    } catch (error) {
      console.error('Error deactivating account:', error);
      alert('An error occurred while deactivating your account.');
    }
  });
});

