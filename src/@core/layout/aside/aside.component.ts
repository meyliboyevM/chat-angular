import { Component } from '@angular/core';
import {SearchComponent} from '../../../app/components/search/search.component';
import {ChatUserComponent} from '../../../app/components/chat-user/chat-user.component';

@Component({
  selector: 'app-aside',
  imports: [SearchComponent, ChatUserComponent],
  templateUrl: './aside.component.html',
  standalone: true,
  styleUrl: './aside.component.scss'
})
export class AsideComponent {

}
