import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {WebSocketService} from '../../common/services/websocket.service';

@Component({
  selector: 'app-home',
  imports: [
    NgClass,
    NgForOf,
    FormsModule,
    NgIf,
    NgStyle,
    DatePipe
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  message: string = '';

  baseUrl = 'https://chat-backend-7t9p.onrender.com/';
  // baseUrl = 'http://127.0.0.1:7000/';

  private http = inject(HttpClient);
  constructor(private wsService: WebSocketService) {
    // this.wsService.connect()
  }

  selectedChat: any = null
  input = '';
  newUserChat = false;
  users: any = []
  chats: any = []
  isLoadingUsers = true;
  isLoadingChats = true;
  message_obj: any = {user: {}, messages: [], last_message:''};
  sending: boolean = false
  isLoadingMessages: boolean = true;

  ngOnInit() {
    this.loadChats()
    this.loadUsers()

    // Подписываемся на WebSocket-сообщения
    this.wsService.messages$.subscribe((message) => {
      this.input = ''; // Очищаем поле ввода
      this.sending = false;

      this.message_obj.messages.push(message)
      this.focusing()
      this.scrollToBottom()
    });
  }

  loadUsers() {
    this.http.get(this.baseUrl +'users').subscribe({
      next: (data: any) => {
        this.users = data;
        this.isLoadingUsers = false;
      },
      error: err => { this.isLoadingUsers = false; }
    });
  }

  loadChats() {
    this.http.get(this.baseUrl + 'chats').subscribe((data: any) => {
      this.chats = data
      this.isLoadingChats = false;
      this.isLoadingMessages = false;
      this.message_obj = this.chats[0]

      if (this.chats.length > 0) {
        this.selectChat(this.chats[0]);
      }
    });
  }


  selectChat(chat: any) {
    this.selectedChat = chat;
    this.wsService.connect(chat.user.id); // Переключаем WebSocket на новый чат
    this.focusing()
  }

  selectItem(item: any, type: boolean) {
    this.wsService.connect(item.id);
    this.newUserChat = type;
    this.selectedChat = item;

    this.message_obj = {
      user: {
        id: item.id,
        phone_number: item.phone_number,
        username: item.username
      },
      messages: type ? [] : item.messages
    };

  }

  sendWSMessage() {
    if (this.input.trim() === '') return;
    this.sending = true;

    const messageData = {
      type: this.newUserChat ? 'create_chat' : 'send_message',
      user2_id: this.selectedChat?.user?.id || this.selectedChat?.id, // ID собеседника
      message: this.input,
    };

    if (this.newUserChat) {
      this.loadChats()
      this.loadUsers()
    }

    this.wsService.sendMessage(messageData);
    this.focusing();
  }

  focusing() {
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 10); // Даем время Angular обновить DOM

    this.scrollToBottom(); // Прокрутка вниз
  }
  scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTo({
          top: this.messagesContainer.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }


  filterChats(type: string) {
    // this.isLoadingChats = true;
    // this.http.get(`https://chat-backend-7t9p.onrender.com/chats?type=${type}`).subscribe({
    //   next: (data: any) => {
    //     this.chats = data;
    //     console.log(data)
    //     this.filteredList = [...data];
    //     this.isLoadingChats = false;
    //   },
    //   error: err => { this.isLoadingChats = false; }
    // });
  }

  generateGradient(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color1 = `hsl(${hash % 360}, 90%, 65%)`;  // Яркий, насыщенный цвет
    const color2 = `hsl(${(hash * 37) % 360}, 85%, 55%)`;  // Чуть темнее для контраста
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }

  logout() {
    localStorage.clear()
    setTimeout(() => {
      window.location.reload();
    }, 100)
  }

  ngOnDestroy() {
    this.wsService.close();
  }
}
