import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a routerLink="/compose">Compose SMS</a>
      <a routerLink="/messages">Messages</a>
      <a routerLink="/account">Account</a>
      <a routerLink="/contacts">Manage Contacts</a>
      <a routerLink="/groups">Manage Groups</a>
    </nav>
  `
})
export class NavigationComponent {}