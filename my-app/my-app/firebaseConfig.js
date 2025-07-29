import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC2VnaYV2ciUyjxHvNhX1s8eJBQd0wIjCs',
  databaseURL: 'https://final-recipe-mate-app-default-rtdb.firebaseio.com/',
  projectId: 'final-recipe-mate-app',
  // messagingSenderId and appId are typically found in the Firebase console when adding an app.
  // They are not strictly necessary for basic authentication and real-time database operations.
  // For full Firebase functionality (e.g., push notifications), these would be required.
  // messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  // appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };


