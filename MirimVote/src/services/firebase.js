import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseConfig from "../firebaseConfig.json";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

async function getUser(uid) {
    if (!uid) {
        window.location.href = '/';
        alert("다시 로그인 부탁드립니다.")
        return null;
    }
    try {
        const response = await fetch('http://localhost:3000/auth/getUser/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${uid}`
            },
            body: JSON.stringify({ uid: uid })
        });
        const data = await response.json()
        const displayName = data.user.displayName.split('_');
        if (displayName.length == 1) {
            data.user.name = displayName[0];
        }
        else {
            data.user.grade = displayName[0].split("")[0];
            data.user.class = displayName[0].split("")[1];
            data.user.name = displayName[1];
        }

        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function logout() {
    signOut(auth);
}

export { app, auth, provider, getUser, logout };