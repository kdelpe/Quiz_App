document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.username : 'User';
    const welcomeMessage = document.getElementById('username');
  
    function generateLetterSpans(text) {
      return text
        .split('')
        .map((char, index) => {
          const letterClass = index % 2 === 0 ? 'letter-1' : 'letter-2';
          return `<span class="letter ${letterClass}">${char}</span>`;
        })
        .join('');
    }
  
    welcomeMessage.innerHTML = `
      <span class="letter letter-1">H</span>
      <span class="letter letter-2">E</span>
      <span class="letter letter-1">L</span>
      <span class="letter letter-2">L</span>
      <span class="letter letter-1">O</span>
      <span class="letter letter-2">,</span>
      <br>
      ${generateLetterSpans(username)}
      <span class="letter letter-1">&ensp;!</span>
    `;
  });
  
document.addEventListener('DOMContentLoaded', async () => {
  const usernameEl = document.getElementById('username');
  //const logoutBtn = document.getElementById('logout-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const leaderboardBtn = document.getElementById('leaderboard-btn');

  async function fetchProfileData() {
    try {

        //usernameEl.textContent = `Welcome, ${data.username}!`;
    } catch (error) {
        console.error('Error fetching profile data:', error);
        // alert('Error loading profile data. Please try again.');
    }
  }

  // Event listeners for buttons
  // logoutBtn.addEventListener('click', () => {
  //     sessionStorage.removeItem('currentUser');
  //     window.location.href = '/logout';
  // });

  startQuizBtn.addEventListener('click', () => {
      window.location.href = '/quiz';
  });

  leaderboardBtn.addEventListener('click', () => {
      window.location.href = '/leaderboard';
  });

  // Load profile data on page load
  fetchProfileData();
});

  