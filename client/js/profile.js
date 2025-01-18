document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.username : 'User';
    const welcomeMessage = document.getElementById('username');
  
    // Function to generate alternating letter classes
    function generateLetterSpans(text) {
      return text
        .split('')
        .map((char, index) => {
          const letterClass = index % 2 === 0 ? 'letter-1' : 'letter-2';
          return `<span class="letter ${letterClass}">${char}</span>`;
        })
        .join('');
    }
  
    // Populate welcome message
    welcomeMessage.innerHTML = `
      <span class="letter letter-1">H</span>
      <span class="letter letter-2">E</span>
      <span class="letter letter-2">L</span>
      <span class="letter letter-1">L</span>
      <span class="letter letter-1">O</span>
      <span class="letter letter-2">,</span>
      <br>
      ${generateLetterSpans(username)}
      <span class="letter letter-2">!</span>
    `;
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const username = currentUser ? currentUser.username : 'User';
    const welcomeMessage = document.getElementById('username');
  
    // Function to generate alternating letter classes
    function generateLetterSpans(text) {
      return text
        .split('')
        .map((char, index) => {
          const letterClass = index % 2 === 0 ? 'letter-1' : 'letter-2';
          return `<span class="letter ${letterClass}">${char}</span>`;
        })
        .join('');
    }
  
    // Populate welcome message
    welcomeMessage.innerHTML = `
      <span class="letter letter-1">H</span>
      <span class="letter letter-2">E</span>
      <span class="letter letter-2">L</span>
      <span class="letter letter-1">L</span>
      <span class="letter letter-1">O</span>
      <span class="letter letter-2">,</span>
      <br>
      ${generateLetterSpans(username)}
      <span class="letter letter-2">!</span>
    `;
  });
  
  document.addEventListener('DOMContentLoaded', async () => {
    const usernameEl = document.getElementById('username');
    const statsBody = document.getElementById('stats-body');
    //const logoutBtn = document.getElementById('logout-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');

    // Fetch profile data
    async function fetchProfileData() {
        try {
            const response = await fetch('/profile');
            if (!response.ok) throw new Error('Failed to fetch profile data');

            const data = await response.json();

            // Display username
            usernameEl.textContent = `Welcome, ${data.username}!`;

            // Populate stats table with the latest stat
            if (data.latestStat) {
                statsBody.innerHTML = `
                    <tr>
                        <td>${new Date().toLocaleDateString()}</td>
                        <td>${data.latestStat.score}</td>
                        <td>${data.latestStat.rank}</td>
                    </tr>
                `;
            } else {
                statsBody.innerHTML = '<tr><td colspan="3">No quiz data available</td></tr>';
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            alert('Error loading profile data. Please try again.');
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

  