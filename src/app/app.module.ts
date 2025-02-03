
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CreatetopicComponent } from './createtopic/createtopic.component';
import { MyOpinionComponent } from './my-opinion/my-opinion.component';
import { AuthService } from './auth.service';
import { ProfileComponent } from './profile/profile.component';
import { ReactionsComponent } from './reactions/reactions.component';
import { AllusersComponent } from './allusers/allusers.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BulkRecordsComponent } from './bulk-records/bulk-records.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ServerModule } from '@angular/platform-server';
import { ToastrModule } from 'ngx-toastr';
import { SimpleComponent } from './simple/simple.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreatetopicComponent,
    HeaderComponent,
    FooterComponent,
    MyOpinionComponent,
    ProfileComponent,
    ReactionsComponent,
    AllusersComponent,
    BulkRecordsComponent,
    UserprofileComponent,
    SimpleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    ServerModule,
    ToastrModule.forRoot() 
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    AuthService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
