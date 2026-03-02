// Firebase Configuration
// Firebase 콘솔 (https://console.firebase.google.com) 에서 프로젝트 생성 후
// 프로젝트 설정 > 일반 > 내 앱 > 웹 앱에서 아래 값을 복사하세요.

const firebaseConfig = {
    apiKey: "AIzaSyBiILKvYHBDODWAGn8vhnGxJfgd0k5YJkU",
    authDomain: "smgm-website-poroject.firebaseapp.com",
    projectId: "smgm-website-poroject",
    storageBucket: "smgm-website-poroject.firebasestorage.app",
    messagingSenderId: "323397320051",
    appId: "1:323397320051:web:15f6ce73feed9c68d39906",
    measurementId: "G-G22DWVBMXN"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = typeof firebase.firestore === 'function' ? firebase.firestore() : null;
const auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
