import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';


export interface UserData {
  id: number
  firstName: string;
  lastName: string;
  status: boolean // active or inactive
  lastMessage: string;
  lastMessageDate: string;
  messageCount: number
  type: 'chat' | 'contacts',
  avatar: string
}


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

  baseUrl = 'https://chat-backend-7t9p.onrender.com/';

  private http = inject(HttpClient);
  selectedChat: any = null
  input = '';
  newUserChat = false;
  users: any = []
  chats: any = []
  isLoadingUsers = true;
  isLoadingChats = true;
  message_obj: any = [];
  sending: boolean = false
  isLoadingMessages: boolean = true;
  isAtBottom = true;

  ngOnInit() {
    this.http.get('https://chat-backend-7t9p.onrender.com/chats').subscribe({
      next: (data: any) => {
        this.chats = data.map((item: any) => (
          {
            id: item['user']['id'],
            username: item['user']['username'],
            phone_number: item['user']['phone_number'],
            messages: item['messages'],
            last_message: item['messages'].length > 0 ? item['messages'].at(-1).message : null
          }));
        this.isLoadingChats = false;
        this.message_obj = this.chats[0]
        this.selectedChat = this.chats[0];
        this.isLoadingMessages = false;
        this.scrollToBottom(); // Прокрутка вниз при загрузке

      },
      error: err => {
        console.error(err);
        this.isLoadingChats = false;
      }
    });

    this.http.get('https://chat-backend-7t9p.onrender.com/users').subscribe({
      next: (data: any) => {
        this.users = data;
        this.isLoadingUsers = false;
      },
      error: err => { this.isLoadingUsers = false; }
    });
  }

  // chats = [
  //   { username: 'Миша Волков', lastMessage: 'Привет!', type: 'all', messages: []},
  //   { username: 'Рамзидин', lastMessage: 'Как ты?', type: 'new', messages: []}
  // ];
  // users = [
  //   { name: 'Алексей Смирнов' },
  //   { name: 'Екатерина Иванова' },
  //   { name: 'Павел Сидоров' }
  // ];


  selectItem(item: any, type: boolean) {
    this.newUserChat = type
      this.selectedChat = item;
    if (type) {
      this.chats.push(item)
      this.users = this.users.filter((el: any) => el.id !== item.id);
    }
      this.message_obj = {
        user: {id: item.id, phone_number: item['phone_number'],username: item['username']},
        messages: item['messages']
      }
  }

  sendMessage() {
    if (this.input.trim() === '') return;
    this.sending = true

    const body = {
      message: this.input,
    };

    if (this.newUserChat) {
      this.http.post(`https://chat-backend-7t9p.onrender.com/chats/create?user2_id=${this.selectedChat.id}`, {}).subscribe({
        next: (data: any) => {

          // Создаём объект чата
          this.message_obj = {
            user: data.user,
            messages: data.messages || [],
          };

          // После создания чата сразу отправляем сообщение
          this.http.post(`https://chat-backend-7t9p.onrender.com/message?target_user_id=${this.selectedChat.id}`, body).subscribe({
            next: (response: any) => {
              this.sending = false
              this.message_obj = {
                ...this.message_obj,
                messages: [...this.message_obj.messages, response]
              };
              this.input = '';
              this.selectedChat.last_essage = response.message;
              setTimeout(() => {
                this.messageInput.nativeElement.focus();
              }, 10); // Даем время Angular обновить DOM
            },
            error: (err) => console.error('Ошибка при отправке сообщения:', err),
          });
        },
        error: (err) => console.error('Ошибка при создании чата:', err),
      });
    } else {

      console.log(this.selectedChat)
      this.http.post(`https://chat-backend-7t9p.onrender.com/message?target_user_id=${this.selectedChat.id}`, body).subscribe({
        next: (response: any) => {
          this.sending = false
          this.selectedChat.messages.push(response);
          this.input = '';
          this.selectedChat.last_message = response.message;

          setTimeout(() => {
            this.messageInput.nativeElement.focus();
          }, 10); // Даем время Angular обновить DOM

          this.scrollToBottom(); // Прокрутка вниз
        },
        error: (err) => console.error('Ошибка при отправке сообщения:', err),
      });
    }
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
}
