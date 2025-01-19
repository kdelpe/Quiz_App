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
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const statsBody = document.getElementById('stats-body');
  const menuBtn = document.getElementById('menu-btn');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const leaderboardBtn = document.getElementById('leaderboard-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const logoutLink = document.getElementById('logout-link');

  if (!currentUser || !currentUser.username) {
      window.location.href = '/login';
      return;
  }

  const username = currentUser.username;

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

  function populateStats(stats) {
      statsBody.innerHTML = '';

      if (!stats || stats.length === 0) {
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

  menuBtn.addEventListener('click', () => {
      dropdownMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (event) => {
      if (!menuBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.add('hidden');
      }
  });

  logoutLink.addEventListener('click', (event) => {
      sessionStorage.removeItem('currentUser');
  });

  startQuizBtn.addEventListener('click', () => window.location.href = '/quiz');
  leaderboardBtn.addEventListener('click', () => window.location.href = '/leaderboard');

  fetchProfileData();
});
