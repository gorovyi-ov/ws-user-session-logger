import io from 'socket.io-client';

const SOCKET_URL = 'ws://localhost:8080';

export default class UserSessionLogger {
  constructor(userId) {
    this.socket = io(SOCKET_URL);
    this.userId = userId;
    this.sessionId = null;
    this.currentPage = null;
  }

  startSession() {
    this.sessionId = Date.now().toString();
    this.socket.emit('session-start', { userId: this.userId, sessionId: this.sessionId });
  }

  endSession() {
    this.socket.emit('session-end', { userId: this.userId, sessionId: this.sessionId });
  }

  logNavigationEvent(page) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.socket.emit('navigation', { userId: this.userId, sessionId: this.sessionId, page });
    }
  }

  logButtonClicked(action, details) {
    this.socket.emit('button-clicked', { userId: this.userId, sessionId: this.sessionId, action, details });
  }
}
