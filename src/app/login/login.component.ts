import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  [x: string]: any;
  loginform: FormGroup;
  password: string = ''; 
  passwordFieldType: string = 'password'; // Default type
  passwordIcon: string = 'fa-eye-slash'; // Default icon

  logindata:any[]=[];

constructor(formBuilder:FormBuilder,private client:HttpClient,private authService: AuthService,private router:Router){
    this.loginform=formBuilder.group({
    email:new FormControl(),
    password:new FormControl(),
  });
}
passwordCheck(fb:FormBuilder){
this.loginform=fb.group({
       email: ['', Validators.required],
      password: ['', Validators.required]
})
}
 login(){
  this.client.post<any>('http://localhost:9090/login',this.loginform.value,{ responseType: 'text' as 'json' }).subscribe(
    (response) => {
      const userData =JSON.parse(response);
      this.authService.setUser(userData);
    console.log(response)
      this.loginform.reset()
      if(response>0){
      //window.location.assign('/dashboard');
      this.router.navigate(['/dashboard'])
      }else{
        alert('Invalid Credentials')
      }
},(error) => {
  if (error.status === 401) {
    alert('User not found');
  } else if (error.status === 500) {
    alert('Server error. Please try again later.');
  } else {
    alert('Something went wrong');
  }
}
)
}
togglePasswordVisibility(event: Event): void {
  event.preventDefault(); // Prevent the default anchor behavior

  // Toggle the input type and icon
  if (this.passwordFieldType === 'password') {
    this.passwordFieldType = 'text';
    this.passwordIcon = 'fa-eye'; // Show icon
  } else {
    this.passwordFieldType = 'password';
    this.passwordIcon = 'fa-eye-slash'; // Hide icon
  }
}
}