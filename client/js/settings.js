document.addEventListener('DOMContentLoaded', () => {
    const deactivateBtn = document.getElementById('deactivate-btn');
    const modal = document.getElementById('deactivate-modal');
    const confirmDeactivateBtn = document.getElementById('confirm-deactivate-btn');
    const cancelDeactivateModalBtn = document.getElementById('cancel-deactivate-modal-btn');
  
    // Show modal on "Deactivate Account" button click
    deactivateBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  
    // Confirm deactivation
    confirmDeactivateBtn.addEventListener('click', () => {
      fetch('/profile/delete', {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message || 'Account deactivated successfully');
          window.location.href = '/logout';
        })
        .catch(error => console.error('Error deactivating account:', error));
    });
  
    // Cancel deactivation and close modal
    cancelDeactivateModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  });
  