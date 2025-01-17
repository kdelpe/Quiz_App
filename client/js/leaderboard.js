// Home button event listener
document.getElementById('home-btn').addEventListener('click', function() {
    window.location.href = '/';
});

// Function to load and display leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch('/data/leaderboardDB.json');
        const data = await response.json();
        
        // Sort leaderboard by score (highest to lowest)
        const sortedLeaderboard = data.leaderboard.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        
        // Update ranks after sorting
        sortedLeaderboard.forEach((entry, index) => {
            entry.rank = (index + 1).toString();
        });

        // Get the table body
        const tableBody = document.querySelector('.score-table tbody');
        tableBody.innerHTML = ''; // Clear existing entries
        
        // Add sorted entries to the table
        sortedLeaderboard.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.rank}</td>
                <td>${entry.user}</td>
                <td>${entry.score}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Load leaderboard when page loads
document.addEventListener('DOMContentLoaded', loadLeaderboard);