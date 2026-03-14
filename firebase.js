import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyBblkFPykTap0c_bIdFPMed9k7uXwIH5YU",
authDomain: "rosa-mexicano-pos.firebaseapp.com",
projectId: "rosa-mexicano-pos",
storageBucket: "rosa-mexicano-pos.firebasestorage.app",
messagingSenderId: "503788049980",
appId: "1:503788049980:web:137d4a223b3788801d5539",
measurementId: "G-J51602XESB"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc, doc }