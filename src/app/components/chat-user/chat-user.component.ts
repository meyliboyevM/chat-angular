import {Component, Input} from '@angular/core';
import {NgIf} from '@angular/common';

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
  @Input() type: 'chat' | 'contacts' | undefined
}
