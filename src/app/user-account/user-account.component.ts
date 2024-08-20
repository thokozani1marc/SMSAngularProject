import { Component } from '@angular/core';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent {
  username: string = 'JohnDoe';
  email: string = 'john@example.com';
}
