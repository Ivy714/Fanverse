// script.js

// **1. Firebase 初始化**
// 🔧 統一在這裡進行 Firebase 初始化，其他 HTML 檔案不再需要重複寫這段
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
// 如果需要 Firestore 或 Realtime Database，也要在這裡引入
// import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
// import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";


// 🔧 Firebase 配置 (確認這是你 Firebase Console 的配置)
const firebaseConfig = {
    apiKey: "AIzaSyArhnDy_H9-nhwf3_IuesFg2leQtHTolfI",
    authDomain: "fanverse-f07eb.firebaseapp.com",
    databaseURL: "https://fanverse-f07eb-default-rtdb.firebaseio.com", // 如果你使用 Realtime Database
    projectId: "fanverse-f07eb",
    storageBucket: "fanverse-f07eb.appspot.com", // 這裡使用 appspot.com 是常見的，不一定是 firebaseapp.com
    messagingSenderId: "352855054633",
    appId: "1:352855054633:web:35f159d6b2ccf1b423ff38",
    measurementId: "G-NT4NL6K2Q2"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ 正確的 getAuth 初始化方式

// 如果使用 Firestore
// const db = getFirestore(app);


// **2. 頁面元素選取**
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
// 🔧 這裡的 ID 需要與 auth.html (原 login.html) 中的 ID 匹配
const showRegisterForm = document.getElementById('show-register-form'); 
const showLoginForm = document.getElementById('show-login-form');

// 這些元素可能只存在於特定的頁面，使用條件判斷確保不報錯
const letterForm = document.getElementById('letter-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const statusMessage = document.getElementById('status-message');
const messageDisplay = document.getElementById('message'); // 你的 login.html 中有這個元素


// 🔧 導覽列的登出按鈕，確保在全局範圍可以被訪問到
const logoutBtn = document.getElementById('logout-btn');


// **3. 使用者認證 (Authentication)**

// 顯示/隱藏登入/註冊表單 (僅在 auth.html 頁面有效)
// 確保程式碼只在 auth.html 執行
if (showRegisterForm && loginForm && registerForm) { // 檢查所有相關元素是否存在
    showRegisterForm.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        if (messageDisplay) messageDisplay.textContent = ""; // 清空提示訊息
    });
}

if (showLoginForm && loginForm && registerForm) { // 檢查所有相關元素是否存在
    showLoginForm.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        if (messageDisplay) messageDisplay.textContent = ""; // 清空提示訊息
    });
}


// 註冊
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        // 🔧 你的 login.html 中沒有 register-username 欄位，所以移除這行，避免錯誤
        // const username = document.getElementById('register-username') ? document.getElementById('register-username').value : '新用戶'; 

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('註冊成功:', user);
                // 🔧 使用 messageDisplay 顯示訊息
                if (messageDisplay) {
                    messageDisplay.style.color = "green";
                    messageDisplay.textContent = "註冊成功！請登入。";
                } else {
                    alert('註冊成功！請登入。');
                }

                registerForm.reset();
                // 註冊成功後，自動切換到登入表單
                if (showLoginForm) { // 模擬點擊「登入」連結
                    showLoginForm.click();
                } else if (loginForm && registerForm) { // 備用手動切換
                     loginForm.style.display = 'block';
                     registerForm.style.display = 'none';
                }
                
                // 這裡可以考慮將註冊的 email 填入登入的 email 欄位，提升用戶體驗
                if (document.getElementById('login-email')) {
                    document.getElementById('login-email').value = email;
                }
            })
            .catch((error) => {
                console.error('註冊失敗:', error);
                // 🔧 使用 messageDisplay 顯示錯誤訊息
                if (messageDisplay) {
                    messageDisplay.style.color = "red";
                    messageDisplay.textContent = '註冊失敗：' + error.message;
                } else {
                    alert('註冊失敗：' + error.message);
                }
            });
    });
}

// 登入
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('登入成功:', user);
                // 🔧 使用 messageDisplay 顯示訊息
                if (messageDisplay) {
                    messageDisplay.style.color = "green";
                    messageDisplay.textContent = "登入成功，導向首頁中...";
                } else {
                    alert('登入成功！');
                }
                loginForm.reset();

                // 登入成功後，跳轉回首頁，加入延遲提升用戶體驗
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500); // 延遲 1.5 秒
            })
            .catch((error) => {
                console.error('登入失敗:', error);
                // 🔧 使用 messageDisplay 顯示錯誤訊息
                if (messageDisplay) {
                    messageDisplay.style.color = "red";
                    messageDisplay.textContent = '登入失敗：' + error.message;
                } else {
                    alert('登入失敗：' + error.message);
                }
            });
    });
}


// 登出
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('登出成功');
                alert('登出成功！');
                window.location.href = 'index.html'; // 登出後跳轉回首頁
            })
            .catch((error) => {
                console.error('登出失敗:', error);
                alert('登出失敗：' + error.message);
            });
    });
}


// 監聽使用者登入狀態
onAuthStateChanged(auth, (user) => {
    const loginNavBtn = document.getElementById('login-nav-btn'); // 導覽列的登入/註冊連結
    // logoutBtn 在上面已經定義為全域變數

    if (user) {
        console.log('使用者已登入:', user.email);
        if (loginNavBtn) {
            loginNavBtn.style.display = 'none'; // 隱藏登入/註冊連結
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'block'; // 顯示登出按鈕
        }
    } else {
        console.log('使用者已登出');
        if (loginNavBtn) {
            loginNavBtn.style.display = 'block'; // 顯示登入/註冊連結
        }
        if (logoutBtn) {
            logoutBtn.style.display = 'none'; // 隱藏登出按鈕
        }
    }
});


// **4. 寫信功能**
// (需要 Firebase Firestore 或 Realtime Database)
if (letterForm) {
    letterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const recipient = document.getElementById('recipient').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const anonymous = document.getElementById('anonymous').checked;

        saveLetter({ recipient, title, content, anonymous })
            .then(() => {
                if (statusMessage) statusMessage.textContent = '信件已送出，正在審核中...';
                letterForm.reset();
            })
            .catch((error) => {
                console.error('儲存信件失敗:', error);
                if (statusMessage) statusMessage.textContent = '儲存信件失敗，請稍後再試。';
            });
    });

    async function saveLetter(letterData) {
        console.log('信件資料:', letterData);
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
}

// **5. 聊天室功能**
// (需要 Firebase Firestore 或 Realtime Database)
if (chatForm) {
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = document.getElementById('chat-input').value;

        sendMessage(message)
            .then(() => {
                chatForm.reset();
            })
            .catch((error) => {
                console.error('傳送訊息失敗:', error);
            });
    });

    async function sendMessage(message) {
        console.log('訊息:', message);
        return new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    }

    async function loadChatMessages() {
        const messages = [
            { user: 'User1', text: 'Hello!', timestamp: Date.now() },
            { user: 'User2', text: 'Hi there!', timestamp: Date.now() },
        ];

        messages.forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            chatMessages.appendChild(messageElement);
        });
    }

    loadChatMessages();
}

// **6. 點數系統**
function awardDailyPoints() {
    const today = new Date().toLocaleDateString();
    if (!localStorage.getItem(`daily-points-${today}`)) {
        const points = 10;
        console.log(`獎勵 ${points} 點`);
        localStorage.setItem(`daily-points-${today}`, 'true');
    }
}

// 可以考慮在 onAuthStateChanged 中，當使用者登入時呼叫 awardDailyPoints
// awardDailyPoints();
