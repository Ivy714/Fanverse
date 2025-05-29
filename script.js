import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyArhnDy_H9-nhwf3_IuesFg2leQtHTolfI",
    authDomain: "fanverse-f07eb.firebaseapp.com",
    databaseURL: "https://fanverse-f07eb-default-rtdb.firebaseio.com",
    projectId: "fanverse-f07eb",
    storageBucket: "fanverse-f07eb.appspot.com",
    messagingSenderId: "352855054633",
    appId: "1:352855054633:web:35f159d6b2ccf1b423ff38",
    measurementId: "G-NT4NL6K2Q2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Firestore 初始化

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterForm = document.getElementById('show-register-form'); 
const showLoginForm = document.getElementById('show-login-form');

const letterForm = document.getElementById('letter-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const statusMessage = document.getElementById('status-message');
const messageDisplay = document.getElementById('message');
const logoutBtn = document.getElementById('logout-btn');

// 切換註冊 / 登入
if (showRegisterForm && loginForm && registerForm) {
    showRegisterForm.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        if (messageDisplay) messageDisplay.textContent = "";
    });
}

if (showLoginForm && loginForm && registerForm) {
    showLoginForm.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        if (messageDisplay) messageDisplay.textContent = "";
    });
}

// ✅ 註冊：新增存入 Firestore 的 name 欄位
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const name = document.getElementById('register-name').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 🔥 新增使用者 Firestore 資料（點數、名稱）
            await setDoc(doc(db, "users", user.uid), {
                points: 500,
                name: name
            });

            console.log('註冊成功:', user);
            if (messageDisplay) {
                messageDisplay.style.color = "green";
                messageDisplay.textContent = "註冊成功！請登入。";
            }

            registerForm.reset();
            if (showLoginForm) {
                showLoginForm.click();
            } else {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            }
            if (document.getElementById('login-email')) {
                document.getElementById('login-email').value = email;
            }

        } catch (error) {
            console.error('註冊失敗:', error);
            if (messageDisplay) {
                messageDisplay.style.color = "red";
                messageDisplay.textContent = '註冊失敗：' + error.message;
            }
        }
    });
}

// ✅ 登入保持不變
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('登入成功:', user);
                if (messageDisplay) {
                    messageDisplay.style.color = "green";
                    messageDisplay.textContent = "登入成功，導向首頁中...";
                }
                loginForm.reset();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            })
            .catch((error) => {
                console.error('登入失敗:', error);
                if (messageDisplay) {
                    messageDisplay.style.color = "red";
                    messageDisplay.textContent = '登入失敗：' + error.message;
                }
            });
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('登出成功');
                alert('登出成功！');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('登出失敗:', error);
                alert('登出失敗：' + error.message);
            });
    });
}

onAuthStateChanged(auth, (user) => {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (user) {
        console.log('使用者已登入:', user.email);
        if (loginNavBtn) loginNavBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
    } else {
        console.log('使用者已登出');
        if (loginNavBtn) loginNavBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});
