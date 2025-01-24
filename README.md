# Project 2: Trivia Quiz

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Team Members and Roles](#team-members-and-roles)
- [How to Run the Server](#how-to-run-the-server)
- [Demo](#demo)

---

## Overview
Trivia Quiz is a simple yet dynamic application where users can test their knowledge through a 10-question quiz. The app comprises five main pages:
1. **Welcome Page**: Allows users to start the quiz.
2. **Profile Page**: Displays user information, navigation options, and stats.
3. **Quiz Page**: Displays the quiz questions with answer options, navigation bar, 30sec timer, background music.
4. **Results Page**: Shows the user’s score after completing the quiz, gif, music based on score ranges.
5. **Settings Page**: Allows users to update their account settings or deactivate their account.
6. **Leaderboard Page**: Displays the 10 top players and their scores by date.

This application uses client-server architecture. The server handles question selection, scoring, and serves the HTML, CSS, and JS files.

---

## Features
### Core Features
- Randomized question selection from a JSON file.
- Questions do not repeat for the same session.
- Tracks and displays user scores and rankings.
- Option to restart the quiz after completion.

### Extra Features
- Timer for the quiz/questions.
- Leaderboard displaying top scores and player rankings.
- Login/signup functionality.
- Settings page to update account details or deactivate the account.
- Animated fireworks for celebrations and interactive design elements.

---

## Team Members and Roles
- **Kervens Delpe**: Team Leader, server setup, backend logic for quiz & timer, Debugging.
- **Angel Difo**: DB (json file) setup, mongoDB migration, Frontend development, CSS styling.
- **Michael Esteban**: Heroku, Frontend development & CSS styling Home Page, Login, Results, Settings, API, docs, Debugging

---

## How to Run the Server
1. Clone this repository:
   ```bash
   git clone [repository-url]
   ```

2. Change into the repository directory
   ```bash
   cd [project_directory]
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open the client in your browser:
   - Visit `http://localhost:[PORT]` 

---

## Demo 
[Walkthrough video link](https://www.youtube.com/watch?v=KmhPbEnsSeU)
