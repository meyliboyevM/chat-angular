import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chat-angular';

  ngOnInit(): void {
    initFlowbite();
  }
}
