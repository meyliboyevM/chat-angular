import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket!: WebSocket;

  connect(): void {
    this.socket = new WebSocket('ws://localhost:8000/ws');

    this.socket.onopen = () => {
      console.log('WebSocket соединение установлено');
    };

    this.socket.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
    };

    this.socket.onclose = () => {
      console.log('WebSocket соединение закрыто');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
    };
  }

  sendMessage(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket не подключен');
    }
  }

  close(): void {
    this.socket.close();
  }
}
