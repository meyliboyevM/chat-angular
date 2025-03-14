import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private messagesSubject = new Subject<any>(); // Поток сообщений
  messages$ = this.messagesSubject.asObservable();
  private chatId!: number; // ID текущего чата

  connect(targetUserId: number): void {
    const token = localStorage.getItem('auth_token'); // Получаем токен
    this.close(); // Закрываем предыдущее соединение (если есть)

    this.chatId = targetUserId; // Сохраняем ID собеседника
    this.socket$ = webSocket(`wss://chat-backend-7t9p.onrender.com/ws/${targetUserId}?token=${token}`);
    // this.socket$ = webSocket(`ws://127.0.0.1:7000/ws/${targetUserId}?token=${token}`);

    this.socket$.subscribe({
      next: (message: any) => {
        // console.log('WebSocket сообщение:', message);
        this.messagesSubject.next(message); // Отправляем в поток
      },
      error: (error: any) => console.error('WebSocket ошибка:', error),
      complete: () => console.log('WebSocket соединение закрыто'),
    });
  }

  sendMessage(message: any): void {
    if (!this.socket$) {
      console.error('WebSocket не подключен');
      return;
    }
    this.socket$.next(message);
  }

  createChat(user2_id: number): void {
    if (!this.socket$) {
      console.error('WebSocket не подключен');
      return;
    }

    const chatData = {
      type: 'create_chat',
      user2_id: user2_id,
    };

    this.socket$.next(chatData);
  }

  close(): void {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null as any;
    }
  }
}
