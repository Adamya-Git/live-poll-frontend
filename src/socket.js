// src/socket.js
import { io } from 'socket.io-client';
const URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
const socket = io(URL, { autoConnect: true });
export default socket;
