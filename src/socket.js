// // src/socket.js
// // import { io } from 'socket.io-client';
// // const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
// // const socket = io(URL, { autoConnect: true });
// // export default socket;

// import { io } from "socket.io-client";
// const socket = io("https://live-poll-backend-l1is.onrender.com/"); 
// // replace with your actual Render backend URL
// export default socket;

import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(SOCKET_URL);

export default socket;
