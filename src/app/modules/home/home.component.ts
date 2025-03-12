import {Component, inject, signal, WritableSignal} from '@angular/core';
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

  baseUrl = 'http://127.0.0.1:8087/';

  private http = inject(HttpClient);
  selectedChat: any = null
  input = '';
  newUserChat = false;
  users: any = []
  chats: any = []
  isLoadingUsers = true;
  isLoadingChats = true;
  message_obj: any = [];
  filteredList: any = [...this.chats];
  tttt: any

  ngOnInit() {
    this.http.get('http://127.0.0.1:8087/chats').subscribe({
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
        console.log(this.chats[0])
        this.message_obj = this.chats[0]
        this.selectedChat = this.chats[0];
      },
      error: err => {
        console.error(err);
        this.isLoadingChats = false;
      }
    });

    this.http.get('http://127.0.0.1:8087/users').subscribe({
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
    if (type) {
      console.log(item)
    }
    console.log(item)
      this.selectedChat = item;
      this.message_obj = {
        user: {id: item.id, phone_number: item['phone_number'],username: item['username']},
        messages: item['messages']
      }
  }

  sendMessage() {
    if (this.input.trim() === '') return;

    const body = {
      message: this.input,
    };

    if (this.newUserChat) {
      this.http.post(`http://127.0.0.1:8087/chats/create?user2_id=${this.selectedChat.id}`, {}).subscribe({
        next: (data: any) => {
          this.tttt = data.user;

          // Создаём объект чата
          this.message_obj = {
            user: data.user,
            messages: data.messages || [],
          };

          // После создания чата сразу отправляем сообщение
          this.http.post(`http://127.0.0.1:8087/message?target_user_id=${this.selectedChat.id}`, body).subscribe({
            next: (response: any) => {
              console.log(response);

              // Добавляем новое сообщение в массив
              this.message_obj = {
                ...this.message_obj,
                messages: [...this.message_obj.messages, response]
              };

              // Очистка инпута
              this.input = '';

              // Обновление последнего сообщения в чате
              this.selectedChat.last_essage = response.message;
            },
            error: (err) => console.error('Ошибка при отправке сообщения:', err),
          });
        },
        error: (err) => console.error('Ошибка при создании чата:', err),
      });
    } else {
      this.http.post(`http://127.0.0.1:8087/message?target_user_id=${this.selectedChat.id}`, body).subscribe({
        next: (response: any) => {
          this.selectedChat.messages.push(response);
          this.input = '';
          this.selectedChat.last_essage = response.message;
        },
        error: (err) => console.error('Ошибка при отправке сообщения:', err),
      });
    }
  }

  filterChats(type: string) {
    // this.isLoadingChats = true;
    // this.http.get(`http://127.0.0.1:8087/chats?type=${type}`).subscribe({
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
}
