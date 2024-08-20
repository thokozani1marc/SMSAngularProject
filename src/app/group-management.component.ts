import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { supabase } from './../supabase.js';

interface Group {
  id: number;
  name: string;
}

@Component({
  selector: 'app-group-management',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
<div class="container mx-auto px-4 py-8">
  <h2 class="text-3xl font-bold mb-6">Group Management</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-bold mb-4">Add/Edit Group</h3>
      <form [formGroup]="groupForm" (ngSubmit)="saveGroup()" class="space-y-4">
        <div>
          <input formControlName="name" placeholder="Group Name" required class="w-full p-3 border rounded shadow-sm">
          <small class="text-red-500" *ngIf="groupForm.get('name')?.invalid && groupForm.get('name')?.touched">
            Group name is required and must be at least 2 characters.
          </small>
        </div>
        <div class="flex space-x-4">
          <button type="submit" [disabled]="groupForm.invalid" class="bg-primary text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300">{{ editingGroup ? 'Update' : 'Add' }} Group</button>
          <button *ngIf="editingGroup" (click)="cancelEdit()" type="button" class="bg-gray-300 px-6 py-3 rounded hover:bg-gray-400 transition duration-300">Cancel</button>
        </div>
      </form>
    </div>
    
    <div>
      <h3 class="text-2xl font-bold mb-4">Groups List</h3>
      <table class="w-full bg-white shadow-md rounded">
        <thead>
          <tr class="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">ID</th>
            <th class="py-3 px-6 text-left">Name</th>
            <th class="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr *ngFor="let group of groups" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6 text-left whitespace-nowrap">{{group.id}}</td>
            <td class="py-3 px-6 text-left">{{group.name}}</td>
            <td class="py-3 px-6 text-center">
              <button (click)="editGroup(group)" class="text-primary hover:text-blue-600 mr-3 transition duration-300">Edit</button>
              <button (click)="deleteGroup(group.id)" class="text-red-500 hover:text-red-600 transition duration-300">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  `
})
export class GroupManagementComponent implements OnInit {
  groups: Group[] = [];
  groupForm: FormGroup;
  editingGroup: Group | null = null;

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
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

  async saveGroup() {
    if (this.groupForm.valid) {
      if (this.editingGroup) {
        const { error } = await supabase
          .from('groups')
          .update({ ...this.groupForm.value, id: this.editingGroup.id })
          .eq('id', this.editingGroup.id);
        if (error) console.error('Error updating group:', error);
        else {
          this.editingGroup = null;
          this.loadGroups();
        }
      } else {
        const { error } = await supabase
          .from('groups')
          .insert(this.groupForm.value);
        if (error) console.error('Error saving group:', error);
        else {
          this.loadGroups();
        }
      }
      this.groupForm.reset({ name: '' });
    }
  }

  editGroup(group: Group) {
    this.editingGroup = group;
    this.groupForm.patchValue(group);
  }

  async deleteGroup(id: number) {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting group:', error);
    else this.loadGroups();
  }

  cancelEdit() {
    this.editingGroup = null;
    this.groupForm.reset({ name: '' });
  }
}