// script.js

// **1. Firebase 初始化**
// (請確保你已將 Firebase 設定程式碼放在 HTML 中，如之前的範例)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// 🔧 Firebase 初始化
const firebaseConfig = {
  apiKey: "AIzaSyArhnDy_H9-nhwf3_IuesFg2leQtHTolfI",
  authDomain: "fanverse-f07eb.firebaseapp.com",
  projectId: "fanverse-f07eb",
  storageBucket: "fanverse-f07eb.appspot.com",
  messagingSenderId: "352855054633",
  appId: "1:352855054633:web:35f159d6b2ccf1b423ff38",
  measurementId: "G-NT4NL6K2Q2"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ 改為這行，初始化時帶入 app


// **2. 頁面元素選取**
// 注意：'login-btn'現在是個導航連結，不再用於JS控制彈出表單，所以移除相關的元素選取
// 'auth-form'現在是獨立頁面的一部分，且預設顯示，所以也移除其選取
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterForm = document.getElementById('show-register-form');
const showLoginForm = document.getElementById('show-login-form');

// 這些元素可能只存在於特定的頁面，使用條件判斷確保不報錯
const letterForm = document.getElementById('letter-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const statusMessage = document.getElementById('status-message');


// **3. 使用者認證 (Authentication)**
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const auth = getAuth();

// 顯示/隱藏登入/註冊表單 (僅在 auth.html 頁面有效)
// 由於登入/註冊功能已移至獨立頁面 (auth.html)，
// 原來的 loginBtn.addEventListener('click', ...) 不再需要，因為它現在是一個頁面跳轉連結。
// authForm 也不再需要透過JS來切換顯示/隱藏，它在 auth.html 中是預設顯示的。

// 檢查 showRegisterForm 和 showLoginForm 是否存在，確保程式碼只在 auth.html 執行
if (showRegisterForm) {
    showRegisterForm.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}

if (showLoginForm) {
    showLoginForm.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
}


// 註冊 (僅在 auth.html 頁面有效)
if (registerForm) { // 檢查 registerForm 是否存在
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const username = document.getElementById('register-username') ? document.getElementById('register-username').value : '新用戶'; // 假設註冊有username欄位，如果沒有則給預設值

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // 註冊成功
                const user = userCredential.user;
                console.log('註冊成功:', user);
                alert('註冊成功！請登入。');

                // 註冊成功後，自動切換到登入表單，並清空註冊表單
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                registerForm.reset();
                // 這裡可以考慮將註冊的 email 填入登入的 email 欄位，提升用戶體驗
                document.getElementById('login-email').value = email;

                // TODO: 如果需要將 username 儲存到 Firebase 的其他服務 (如 Firestore)，在此處添加邏輯
                // 例如：setDoc(doc(db, "users", user.uid), { username: username, email: email });
            })
            .catch((error) => {
                // 註冊失敗
                console.error('註冊失敗:', error);
                alert('註冊失敗：' + error.message);
            });
    });
}

// 登入 (僅在 auth.html 頁面有效)
if (loginForm) { // 檢查 loginForm 是否存在
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // 登入成功
                const user = userCredential.user;
                console.log('登入成功:', user);
                alert('登入成功！');
                loginForm.reset();

                // 登入成功後，跳轉回首頁
                window.location.href = 'index.html';
            })
            .catch((error) => {
                // 登入失敗
                console.error('登入失敗:', error);
                alert('登入失敗：' + error.message);
            });
    });
}


// 登出（範例）
// 這個功能需要在每個頁面都能操作，所以要確保導覽列上有個登出按鈕
// 假設你有一個 id="logout-btn" 的登出按鈕
const logoutBtn = document.getElementById('logout-btn'); // 需要在你的 HTML 中添加這個按鈕

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                console.log('登出成功');
                alert('登出成功！');
                // 登出後跳轉回首頁或登入頁面
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('登出失敗:', error);
                alert('登出失敗：' + error.message);
            });
    });
}


// 監聽使用者登入狀態
// 這個函數會在所有頁面執行，用於更新 UI 狀態
onAuthStateChanged(auth, (user) => {
    const loginNavBtn = document.getElementById('login-nav-btn'); // 導覽列的登入/註冊連結
    // const profileLink = document.getElementById('profile-link'); // 假設未來會有個人資料連結
    // const logoutBtn = document.getElementById('logout-btn'); // 導覽列的登出按鈕

    if (user) {
        // 使用者已登入
        console.log('使用者已登入:', user.email);
        // 如果使用者已登入，隱藏「登入/註冊」連結，顯示「登出」連結 (如果存在)
        if (loginNavBtn) {
            loginNavBtn.style.display = 'none';
        }
        // if (profileLink) { profileLink.style.display = 'block'; }
        if (logoutBtn) { // 如果有登出按鈕，顯示它
            logoutBtn.style.display = 'block';
        }
        // TODO: 更新 UI 以顯示使用者已登入狀態，例如顯示使用者名稱
        // 可以在這裡儲存使用者名稱到 localStorage 或 SessionStorage，以便在其他頁面使用
        // console.log('使用者 UID:', user.uid);
        // console.log('使用者顯示名稱:', user.displayName); // 如果你在註冊時有設定 displayName
    } else {
        // 使用者已登出
        console.log('使用者已登出');
        // 如果使用者已登出，顯示「登入/註冊」連結，隱藏「登出」連結 (如果存在)
        if (loginNavBtn) {
            loginNavBtn.style.display = 'block';
        }
        // if (profileLink) { profileLink.style.display = 'none'; }
        if (logoutBtn) { // 如果有登出按鈕，隱藏它
            logoutBtn.style.display = 'none';
        }
        // TODO: 更新 UI 以顯示使用者已登出狀態
    }
});


// **4. 寫信功能**
// (需要 Firebase Firestore 或 Realtime Database)
if (letterForm) {
    letterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // 阻止表單預設的送出行為

        const recipient = document.getElementById('recipient').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const anonymous = document.getElementById('anonymous').checked;

        // 將信件資料儲存到 Firebase
        saveLetter({ recipient, title, content, anonymous })
            .then(() => {
                statusMessage.textContent = '信件已送出，正在審核中...';
                letterForm.reset(); // 清除表單
            })
            .catch((error) => {
                console.error('儲存信件失敗:', error);
                statusMessage.textContent = '儲存信件失敗，請稍後再試。';
            });
    });

    // 儲存信件到 Firebase 的函式 (需要實作)
    async function saveLetter(letterData) {
        // TODO: 連接 Firebase Firestore 或 Realtime Database
        // 並將 letterData 儲存到資料庫中
        console.log('信件資料:', letterData);
        return new Promise((resolve) => {
            setTimeout(resolve, 1000); // 模擬儲存成功
        });
    }
}

// **5. 聊天室功能**
// (需要 Firebase Firestore 或 Realtime Database)
if (chatForm) {
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = document.getElementById('chat-input').value;

        // 將訊息傳送到 Firebase
        sendMessage(message)
            .then(() => {
                chatForm.reset();
            })
            .catch((error) => {
                console.error('傳送訊息失敗:', error);
            });
    });

    // 傳送訊息到 Firebase 的函式 (需要實作)
    async function sendMessage(message) {
        // TODO: 連接 Firebase Firestore 或 Realtime Database
        // 並將訊息儲存到聊天室
        console.log('訊息:', message);
        return new Promise((resolve) => {
            setTimeout(resolve, 500); // 模擬傳送成功
        });
    }

    // 載入聊天室訊息 (需要實作)
    async function loadChatMessages() {
        // TODO: 從 Firebase 讀取聊天室訊息
        // 並顯示在 chatMessages 元素中
        const messages = [
            { user: 'User1', text: 'Hello!', timestamp: Date.now() },
            { user: 'User2', text: 'Hi there!', timestamp: Date.now() },
        ]; // 模擬訊息

        messages.forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            chatMessages.appendChild(messageElement);
        });
    }

    loadChatMessages(); // 頁面載入時載入訊息
}

// **6. 點數系統**
// (需要 Firebase Firestore 或 Realtime Database, Firebase Functions (雲端函式) 較佳)
// 範例：每日登入獎勵 (簡化)
function awardDailyPoints() {
    // TODO: 檢查使用者是否已領取今日獎勵
    const today = new Date().toLocaleDateString();
    if (!localStorage.getItem(`daily-points-${today}`)) {
        const points = 10; // 每日獎勵點數
        // TODO: 更新 Firebase 中的使用者點數餘額
        console.log(`獎勵 ${points} 點`);
        localStorage.setItem(`daily-points-${today}`, 'true'); // 紀錄已領取
    }
}

// 通常只在使用者登入時或特定頁面執行，可以考慮放在 onAuthStateChanged 裡
// awardDailyPoints();

// **7. 其他功能**
// (例如：AI 審核、排行榜等)
// TODO: 實作其他功能
