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
  
// document.addEventListener('DOMContentLoaded', async () => {
//   const logoutBtn = document.getElementById('logout-btn');
//   const startQuizBtn = document.getElementById('start-quiz-btn');
//   const leaderboardBtn = document.getElementById('leaderboard-btn');

//   async function fetchProfileData() {
//     try {
//       const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
//       const username = currentUser ? currentUser.username : null;
//       if (!username) {
//           alert('User not logged in.');
//           return;
//       }

//       const response = await fetch(`/profile/data?username=${encodeURIComponent(username)}`);
//       const data = await response.json();

//       if (response.ok) {
//         // Update the welcome message
//         // const welcomeMessage = document.getElementById('username');
//         // welcomeMessage.textContent = `Welcome, ${data.username}!`;

//         // Populate the stats table
//         const statsBody = document.getElementById('stats-body');
//         statsBody.innerHTML = ''; // Clear previous entries
//         data.stats.forEach(stat => {
//           const row = document.createElement('tr');
//           row.innerHTML = `
//             <td>${stat.date}</td>
//             <td>${stat.score}</td>
//             <td>${stat.rank}</td>
//           `;
//           statsBody.appendChild(row);
//         });
//       } else {
//         alert(data.error || 'Failed to load profile data.');
//       }
//     } catch (error) {
//       console.error('Error loading profile stats:', error);
//     }
//   }

//   // Logout functionality
//   logoutBtn.addEventListener('click', () => {
//     sessionStorage.removeItem('currentUser');
//     window.location.href = '/logout';
//   });

//   // Navigation buttons
//   startQuizBtn.addEventListener('click', () => window.location.href = '/quiz');
//   leaderboardBtn.addEventListener('click', () => window.location.href = '/leaderboard');

//   // Fetch and display data
//   fetchProfileData();
// });

document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const usernameEl = document.getElementById('username');
  const statsBody = document.getElementById('stats-body');
  const logoutBtn = document.getElementById('logout-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const leaderboardBtn = document.getElementById('leaderboard-btn');

  if (!currentUser || !currentUser.username) {
      alert('You are not logged in. Redirecting to login page...');
      window.location.href = '/login';
      return;
  }

  // Display welcome message
  const username = currentUser.username;
  //usernameEl.textContent = `Hello, ${username}!`;

  // Fetch user stats
  async function fetchProfileData() {
      try {
          const response = await fetch(`/profile/data?username=${encodeURIComponent(username)}`);
          if (!response.ok) {
              throw new Error('Failed to fetch profile data');
          }

          const data = await response.json();
          populateStats(data.stats);
      } catch (error) {
          console.error('Error fetching profile data:', error);
          alert('Error loading profile data.');
      }
  }

  // Populate the stats table
  function populateStats(stats) {
      if (stats.length === 0) {
          statsBody.innerHTML = `<tr><td colspan="3">No stats available</td></tr>`;
          return;
      }

      statsBody.innerHTML = stats
          .map(stat => `
              <tr>
                  <td>${stat.date}</td>
                  <td>${stat.score}</td>
                  <td>${stat.rank || 'N/A'}</td>
              </tr>
          `)
          .join('');
  }

  // Logout functionality
  logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('currentUser');
      window.location.href = '/login';
  });

  // Navigation buttons
  startQuizBtn.addEventListener('click', () => window.location.href = '/quiz');
  leaderboardBtn.addEventListener('click', () => window.location.href = '/leaderboard');

  // Fetch profile data on page load
  fetchProfileData();
});
