import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreatetopicComponent } from './createtopic/createtopic.component';
import { ReactionsComponent } from './reactions/reactions.component';
import { AllusersComponent } from './allusers/allusers.component';
import { ProfileComponent } from './profile/profile.component';
import { BulkRecordsComponent } from './bulk-records/bulk-records.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SimpleComponent } from './simple/simple.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'dashboard', component: DashboardComponent },
  {path:'createtopic',component:CreatetopicComponent},
  {path:'reaction',component:ReactionsComponent},
  {path:'allusers',component:AllusersComponent},
  {path:'profile',component:ProfileComponent},
  {path:'bulk',component:BulkRecordsComponent},
  {path:'userprofile',component:UserprofileComponent},
  {path:'simple',component:SimpleComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
