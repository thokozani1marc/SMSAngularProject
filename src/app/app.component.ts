import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { ContactManagementComponent } from './contact-management/contact-management.component';
import { NavigationComponent } from './navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-project';
}
