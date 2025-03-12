import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [ RouterOutlet],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {

}
