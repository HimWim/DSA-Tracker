# DSA Progress Tracker

A web application designed to help track and motivate juniors to practice Data Structures and Algorithms (DSA). It features a competitive leaderboard where users are identified by unique, anonymous usernames, fostering a spirit of friendly competition without revealing real identities.

---

## Features

- **Secure Authentication:** Users can sign up and log in with their email and password. The application includes a secure password reset feature.
- **Anonymous Usernames:** On signup, users choose their own unique username, which is used on the public leaderboard to maintain anonymity.
- **Competitive Leaderboard:** A real-time dashboard that displays all users ranked by the number of DSA problems they have solved.
- **Progress Tracking:** Users can easily add the number of problems they've solved or correct mistakes by decreasing the count.
- **Account Management:** Users have full control to permanently delete their own accounts.

---

## Tech Stack

This project is built with a modern, scalable tech stack:

- **Frontend:** [React](https://reactjs.org/) (with Vite)
- **Backend & Database:** [Firebase](https://firebase.google.com/)
  - **Authentication:** For managing user sign-up, login, and security.
  - **Firestore:** A NoSQL database for storing user profiles and progress in real-time.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repository-name
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```

### Environment Variables

To run the application, you need to connect it to your own Firebase project.

1.  Create a file named `.env.local` in the root of your project.
2.  Add your Firebase project's configuration keys to this file. **Remember to prefix each key with `VITE_`** as required by Vite.

    ```
    VITE_FIREBASE_API_KEY=AIzaSy...
    VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
    VITE_FIREBASE_APP_ID=1:123456...
    ```

### Running the Application

Once the environment variables are set, you can start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

---

## Deployment

This project is configured for easy deployment on [Netlify](https://www.netlify.com/).

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`

The site is set up for continuous deployment. Any push to the `main` branch on GitHub will automatically trigger a new build and deploy the latest version of the application.

- Live -> https://anonydsa.netlify.app/
