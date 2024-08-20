import { Component , OnInit} from '@angular/core';
import { SmsService } from '../sms.service';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-sms-list',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './sms-list.component.html',
  styleUrl: './sms-list.component.css'
})
  export class SmsListComponent implements OnInit {
    messages: any[] = [];

    constructor(private smsService: SmsService) { }

    ngOnInit() {
      this.loadMessages();
    }

    async loadMessages() {
      try {
        this.messages = await this.smsService.getMessages();
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }
