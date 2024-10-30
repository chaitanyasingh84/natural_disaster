// Import the functions you need from the SDKs you need
//Most likely need to change the firebase/analytics part
const {initializeApp} = require("firebase/app");
const {getFirestore} = require("firebase/firestore");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgoVGQmuQPqsmYDFYuS6mmDl8QQhtAkDI",
  authDomain: "newhacksreliefgrid.firebaseapp.com",
  databaseURL: "https://newhacksreliefgrid-default-rtdb.firebaseio.com",
  projectId: "newhacksreliefgrid",
  storageBucket: "newhacksreliefgrid.firebasestorage.app",
  messagingSenderId: "774372466377",
  appId: "1:774372466377:web:e49f20acba163c153db718",
  measurementId: "G-Q5H28EYXH6"
};

// Initialize Firebase
let app;
let firestoreDb;
//const analytics = getAnalytics(app);

const getFirebaseApp = () => {
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore();
  return app;
};

module.exports = {
  initializeApp,
  getFirebaseApp,
};