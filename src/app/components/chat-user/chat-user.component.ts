import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';
import {UserData} from '../../modules/home/home.component';

@Component({
  selector: 'app-chat-user',
  imports: [
    NgIf
  ],
  templateUrl: './chat-user.component.html',
  standalone: true,
  styleUrl: './chat-user.component.scss'
})
export class ChatUserComponent {
  @Input() data!: UserData
  @Input() type: 'chat' | 'contacts' | undefined
}
