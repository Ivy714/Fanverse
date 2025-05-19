//  script.js

//  **1. Firebase 初始化**
//  (請確保你已將 Firebase 設定程式碼放在 HTML 中，如之前的範例)

//  **2. 頁面元素選取**
const loginBtn = document.getElementById('login-btn');
const authForm = document.getElementById('auth-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterForm = document.getElementById('show-register-form');
const showLoginForm = document.getElementById('show-login-form');
const letterForm = document.getElementById('letter-form');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const statusMessage = document.getElementById('status-message');

//  **3. 使用者認證 (Authentication)**
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const auth = getAuth();

//  顯示/隱藏表單
loginBtn.addEventListener('click', () => {
    authForm.style.display = authForm.style.display === 'none' ? 'block' : 'none';
});

showRegisterForm.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginForm.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

//  註冊
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //  註冊成功
            const user = userCredential.user;
            console.log('註冊成功:', user);
            alert('註冊成功！請登入。');
            authForm.style.display = 'none'; //  隱藏表單
            registerForm.reset();
        })
        .catch((error) => {
            //  註冊失敗
            console.error('註冊失敗:', error);
            alert('註冊失敗：' + error.message);
        });
});

//  登入
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //  登入成功
            const user = userCredential.user;
            console.log('登入成功:', user);
            alert('登入成功！');
            authForm.style.display = 'none'; //  隱藏表單
            loginForm.reset();
            //  TODO: 更新 UI 以顯示使用者已登入
        })
        .catch((error) => {
            //  登入失敗
            console.error('登入失敗:', error);
            alert('登入失敗：' + error.message);
        });
});

//  登出（範例）
function logout() {
    signOut(auth)
        .then(() => {
            console.log('登出成功');
            alert('登出成功！');
            //  TODO: 更新 UI 以顯示使用者已登出
        })
        .catch((error) => {
            console.error('登出失敗:', error);
            alert('登出失敗：' + error.message);
        });
}

//  TODO: 在適當的地方呼叫 logout() 函式，例如點擊登出按鈕

//  監聽使用者登入狀態 (範例)
onAuthStateChanged(auth, (user) => {
    if (user) {
        //  使用者已登入
        console.log('使用者已登入:', user);
        //  TODO: 更新 UI 以顯示使用者已登入狀態
    } else {
        //  使用者已登出
        console.log('使用者已登出');
        //  TODO: 更新 UI 以顯示使用者已登出狀態
    }
});

//  **4. 寫信功能**
//  (需要 Firebase Firestore 或 Realtime Database)
if (letterForm) {
    letterForm.addEventListener('submit', (event) => {
        event.preventDefault(); //  阻止表單預設的送出行為

        const recipient = document.getElementById('recipient').value;
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const anonymous = document.getElementById('anonymous').checked;

        //  將信件資料儲存到 Firebase
        saveLetter({ recipient, title, content, anonymous })
            .then(() => {
                statusMessage.textContent = '信件已送出，正在審核中...';
                letterForm.reset(); //  清除表單
            })
            .catch((error) => {
                console.error('儲存信件失敗:', error);
                statusMessage.textContent = '儲存信件失敗，請稍後再試。';
            });
    });

    //  儲存信件到 Firebase 的函式 (需要實作)
    async function saveLetter(letterData) {
        //  TODO: 連接 Firebase Firestore 或 Realtime Database
        //  並將 letterData 儲存到資料庫中
        console.log('信件資料:', letterData);
        return new Promise((resolve) => {
            setTimeout(resolve, 1000); //  模擬儲存成功
        });
    }
}

//  **5. 聊天室功能**
//  (需要 Firebase Firestore 或 Realtime Database)
if (chatForm) {
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = document.getElementById('chat-input').value;

        //  將訊息傳送到 Firebase
        sendMessage(message)
            .then(() => {
                chatForm.reset();
            })
            .catch((error) => {
                console.error('傳送訊息失敗:', error);
            });
    });

    //  傳送訊息到 Firebase 的函式 (需要實作)
    async function sendMessage(message) {
        //  TODO: 連接 Firebase Firestore 或 Realtime Database
        //  並將訊息儲存到聊天室
        console.log('訊息:', message);
        return new Promise((resolve) => {
            setTimeout(resolve, 500); //  模擬傳送成功
        });
    }

    //  載入聊天室訊息 (需要實作)
    async function loadChatMessages() {
        //  TODO: 從 Firebase 讀取聊天室訊息
        //  並顯示在 chatMessages 元素中
        const messages = [
            { user: 'User1', text: 'Hello!', timestamp: Date.now() },
            { user: 'User2', text: 'Hi there!', timestamp: Date.now() },
        ]; //  模擬訊息

        messages.forEach((msg) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${msg.user}: ${msg.text}`;
            chatMessages.appendChild(messageElement);
        });
    }

    loadChatMessages(); //  頁面載入時載入訊息
}

//  **6. 點數系統**
//  (需要 Firebase Firestore 或 Realtime Database, Firebase Functions (雲端函式) 較佳)
//  範例：每日登入獎勵 (簡化)
function awardDailyPoints() {
    //  TODO: 檢查使用者是否已領取今日獎勵
    const today = new Date().toLocaleDateString();
    if (!localStorage.getItem(`daily-points-${today}`)) {
        const points = 10; //  每日獎勵點數
        //  TODO: 更新 Firebase 中的使用者點數餘額
        console.log(`獎勵 ${points} 點`);
        localStorage.setItem(`daily-points-${today}`, 'true'); //  紀錄已領取
    }
}

awardDailyPoints();

//  **7. 其他功能**
//  (例如：AI 審核、排行榜等)
//  TODO: 實作其他功能
