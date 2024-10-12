const loginDiv = document.getElementById('login');
const mainDiv = document.getElementById('main');
const userList = document.getElementById('userList');
const scanButton = document.getElementById('scanButton');
const chatRoom = document.getElementById('chatRoom');
const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const statusElement = document.getElementById('status');
const usernameInput = document.getElementById('username');
const loginButton = document.getElementById('loginButton');

let currentUser = null;
let currentPosition = null;
let pusher = null;
let channel = null;

// Initialize Pusher
function initializePusher() {
    pusher = new Pusher('3e4976fd0223f8ea9030', {
        cluster: 'us2'
    });
    channel = pusher.subscribe('proximity-chat');
    
    channel.bind('user-update', function(data) {
        updateUserList(data.users);
    });
    
    channel.bind('chat-message', function(data) {
        if (data.recipient === currentUser.id) {
            displayMessage(data.sender, data.message);
        }
    });
}

// ... rest of the file remains unchanged ...