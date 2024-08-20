import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from './../../supabase.js';

interface Contact {
  id: number;
  name: string;
  phone: string;
  group_id: number;
}

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact-management.component.html',
})
export class ContactManagementComponent implements OnInit {
  contacts: Contact[] = [];
  groups: Group[] = [];
  contactForm: FormGroup;
  editingContact: Contact | null = null;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+27|0)[6-8][0-9]{8}$/)]],
      group_id: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadContacts();
    this.loadGroups();
  }

  async loadContacts() {
    const { data, error } = await supabase
      .from('contact')
      .select('*, groups(name)')
      .order('name');
    if (error) console.error('Error loading contacts:', error);
    else this.contacts = data || [];
  }

  async loadGroups() {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('name');
    if (error) console.error('Error loading groups:', error);
    else this.groups = data || [];
  }

  async saveContact() {
    if (this.contactForm.valid) {
      if (this.editingContact) {
        const { error } = await supabase
          .from('contact')
          .update({ ...this.contactForm.value, id: this.editingContact.id })
          .eq('id', this.editingContact.id);
        if (error) console.error('Error updating contact:', error);
        else {
          this.editingContact = null;
          this.loadContacts();
        }
      } else {
        const { error } = await supabase
          .from('contact')
          .insert(this.contactForm.value);
        if (error) console.error('Error saving contact:', error);
        else {
          this.loadContacts();
        }
      }
      this.contactForm.reset({ name: '', phone: '', group_id: 0 });
    }
  }

  editContact(contact: Contact) {
    this.editingContact = contact;
    this.contactForm.patchValue(contact);
  }

  async deleteContact(id: number) {
    const { error } = await supabase
      .from('contact')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting contact:', error);
    else this.loadContacts();
  }

  cancelEdit() {
    this.editingContact = null;
    this.contactForm.reset({ name: '', phone: '', group_id: 0 });
  }
}