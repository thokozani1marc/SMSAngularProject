import { Injectable } from '@angular/core';
import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiKey = '92de0f63-0357-4116-9e45-4f68745d10f1';
  private apiSecret = 'FNeEVVLAwc0vBHLh2EVozLJslg66Bp89';
  private accountApiCredentials = this.apiKey + ':' + this.apiSecret;
  private base64Credentials = btoa(this.accountApiCredentials);

  private requestHeaders = {
    'Authorization': `Basic ${this.base64Credentials}`,
    'Content-Type': 'application/json'
  };

  constructor() { }

  async sendSingleSMS(phoneNumber: string, message: string) {
    const requestData = JSON.stringify({
      messages: [{
        content: message,
        destination: phoneNumber
      }]
    });

    try {
      const response = await fetch('https://rest.smsportal.com/bulkmessages', {
        method: 'POST',
        headers: this.requestHeaders,
        body: requestData
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      console.log("SMS sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      throw error;
    }
  }

  async sendGroupSMS(groupId: number, message: string) {
    try {
      const { data: contacts, error: fetchError } = await supabase
        .from('contact')
        .select('phone')
        .eq('group_id', groupId);

      if (fetchError) {
        throw new Error('Failed to fetch contacts: ' + fetchError.message);
      }

      const phoneNumbers = contacts.map(contact => contact.phone);
      const messages = phoneNumbers.map(phoneNumber => ({
        content: message,
        destination: phoneNumber
      }));

      const requestData = JSON.stringify({ messages });

      const response = await fetch('https://rest.smsportal.com/bulkmessages', {
        method: 'POST',
        headers: this.requestHeaders,
        body: requestData
      });

      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      console.log("Group SMS sent successfully:", data);
      return data;
    } catch (error) {
      console.error("Failed to send group SMS:", error);
      throw error;
    }
  }

  async getMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}