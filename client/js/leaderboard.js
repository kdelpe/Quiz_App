// document.getElementById('home-btn').addEventListener('click', function() {
//     window.location.href = '/';
// });


// async function loadLeaderboard() {
//     try {
//         const response = await fetch('/data/leaderboardDB.json');
//         const data = await response.json();
        
//         const sortedLeaderboard = data.leaderboard.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        
//         sortedLeaderboard.forEach((entry, index) => {
//             entry.rank = (index + 1).toString();
//         });

//         const tableBody = document.querySelector('.score-table tbody');
//         tableBody.innerHTML = ''; 
        
//         // Add sorted entries to the table
//         sortedLeaderboard.forEach(entry => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${entry.rank}</td>
//                 <td>${entry.user}</td>
//                 <td>${entry.score}</td>
//             `;
//             tableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error('Error loading leaderboard:', error);
//     }
// }

// // Load leaderboard when page loads
// document.addEventListener('DOMContentLoaded', loadLeaderboard);

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('.score-table tbody');
    const homeBtn = document.getElementById('home-btn');

    // Load leaderboard data
    async function loadLeaderboard() {
        try {
            const response = await fetch('/data/leaderboardDB.json');
            if (!response.ok) {
                throw new Error('Failed to load leaderboard');
            }

            const data = await response.json();
            const sortedLeaderboard = data.leaderboard.slice(0, 10);
            populateLeaderboard(sortedLeaderboard);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            alert('Error loading leaderboard data.');
        }
    }

    // Populate the leaderboard table
    function populateLeaderboard(entries) {
        if (entries.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3">No leaderboard data available</td></tr>`;
            return;
        }

        tableBody.innerHTML = entries
            .map(entry => `
                <tr>
                    <td>${entry.rank}</td>
                    <td>${entry.user}</td>
                    <td>${entry.score}</td>
                </tr>
            `)
            .join('');
    }

    // Navigate to home page
    homeBtn.addEventListener('click', () => window.location.href = '/profile');

    // Load leaderboard on page load
    loadLeaderboard();
});