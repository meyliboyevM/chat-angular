import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() userId: number | undefined;

  userData = {
    "id": 1,
    "firstName": "John",
    "lastName": "Smith",
    "status": true,
    "avatar": "https://i.pravatar.cc/150?img=1",
    "lastMessage": "Hey, how are you?",
    "lastMessageDate": "02:15AM",
    "messageCount": 3,
    "type": "chat"
  }

}
