import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createtopic',
  templateUrl: './createtopic.component.html',
  styleUrl: './createtopic.component.css'
})
export class CreatetopicComponent  implements OnInit {
  user: any;
  topicform:FormGroup;
  creatorId: any;
  
  constructor(formBuilder:FormBuilder,private client:HttpClient,private authService: AuthService,private router:Router) {
    this.topicform=formBuilder.group({
      id:new FormControl(),
      topicName:new FormControl(),
      creatorId: new FormControl(),
      reason:new FormControl(),
      date:new FormControl()
    })
  }
  createTpoic(){
    this.topicform.patchValue({
      creatorId: this.user ? this.user : null
    });
    this.client.post<any>('http://localhost:9090/topic',this.topicform.value).subscribe(data=>{
      console.log(data)
      this.topicform.reset()
    })
  }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log(this.user);
  }
  validation(){
    if(this.topicform.value.topicName==null||this.topicform.value.reason==null||this.topicform.value.date==null){
      alert('Pleas fill all topic details');
    }else{
        this.createTpoic()
    }
  }
}
