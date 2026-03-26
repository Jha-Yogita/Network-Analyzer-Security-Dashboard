import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(onPacketUpdate, onSecurityAlert, onError) {
    this.socket = io(`${SOCKET_URL}/network`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('packet_update', (data) => {
      onPacketUpdate(data);
    });

    this.socket.on('security_alert', (data) => {
      onSecurityAlert(data);
    });

    this.socket.on('error', (error) => {
      onError(error);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return this.socket;
  }

  requestSnapshot() {
    if (this.socket) {
      this.socket.emit('request_snapshot');
    }
  }

  pauseCapture() {
    if (this.socket) {
      this.socket.emit('pause_capture');
    }
  }

  resumeCapture() {
    if (this.socket) {
      this.socket.emit('resume_capture');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();