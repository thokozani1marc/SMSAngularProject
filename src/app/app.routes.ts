import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsComposeComponent } from './sms-compose/sms-compose.component';
import { SmsListComponent } from './sms-list/sms-list.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { ContactManagementComponent } from './contact-management/contact-management.component';
import { GroupManagementComponent } from './group-management.component';

export const routes: Routes = [
  { path: 'compose', component: SmsComposeComponent },
  { path: 'messages', component: SmsListComponent },
  { path: 'account', component: UserAccountComponent },
  { path: 'contacts', component: ContactManagementComponent },
  { path: 'groups', component: GroupManagementComponent },
  { path: '', redirectTo: '/compose', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }