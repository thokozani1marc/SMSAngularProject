import { Component, OnInit } from '@angular/core';
import { SmsService } from '../sms.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from './../../supabase.js';

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-sms-compose',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sms-compose.component.html',
  styleUrl: './sms-compose.component.css'
})
export class SmsComposeComponent implements OnInit {
  singleSmsForm: FormGroup;
  groupSmsForm: FormGroup;
  groups: Group[] = [];

  constructor(private smsService: SmsService, private fb: FormBuilder) {
    this.singleSmsForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+27|0)[6-8][0-9]{8}$/)]],
      message: ['', [Validators.required, Validators.maxLength(160)]]
    });

    this.groupSmsForm = this.fb.group({
      selectedGroupId: [0, [Validators.required, Validators.min(1)]],
      message: ['', [Validators.required, Validators.maxLength(160)]]
    });
  }

  ngOnInit() {
    this.loadGroups();
  }

  async loadGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    if (error) console.error('Error loading groups:', error);
    else this.groups = data || [];
  }

  async sendSingleSMS() {
    if (this.singleSmsForm.valid) {
      try {
        await this.smsService.sendSingleSMS(
          this.singleSmsForm.get('phoneNumber')?.value,
          this.singleSmsForm.get('message')?.value
        );
        alert('SMS sent successfully!');
        this.singleSmsForm.reset();
      } catch (error) {
        alert('Failed to send SMS: ' + JSON.stringify(error));
      }
    }
  }

  async sendGroupSMS() {
    if (this.groupSmsForm.valid) {
      try {
        await this.smsService.sendGroupSMS(
          this.groupSmsForm.get('selectedGroupId')?.value,
          this.groupSmsForm.get('message')?.value
        );
        alert('Group SMS sent successfully!');
        this.groupSmsForm.reset();
      } catch (error) {
        alert('Failed to send group SMS: ' + JSON.stringify(error));
      }
    }
  }
}