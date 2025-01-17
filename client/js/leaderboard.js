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

        // Get the leaderboard list container
        const leaderboardList = document.querySelector('.leaderboard-list');
        leaderboardList.innerHTML = ''; // Clear existing entries
        
        // Add sorted entries
        sortedLeaderboard.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            entryElement.setAttribute('data-rank', entry.rank);
            
            entryElement.innerHTML = `
                <div class="rank">#${entry.rank}</div>
                <div class="user">${entry.user}</div>
                <div class="score">${entry.score} pts</div>
            `;
            
            leaderboardList.appendChild(entryElement);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Load leaderboard when page loads
document.addEventListener('DOMContentLoaded', loadLeaderboard);