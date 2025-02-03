import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reactions',
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.css'
})
export class ReactionsComponent {
user:any
alltopic:any[]=[]
allReaction:any[]=[]
reactionForm:FormGroup
  constructor(private formBuileder:FormBuilder,private client:HttpClient,private authService:AuthService){
    this.reactionForm=formBuileder.group({
      id:new FormControl(),
      comment:new FormControl(),
      userId:new FormControl(),
      reason:new FormControl(),
      topicId:new FormControl(),
      date:new FormControl()
    })    
    }
    addComment(topicId:number){
      console.log(topicId),
      this.reactionForm.patchValue({
        userId: this.user ? this.user : null,
        date: this.getCurrentDate(),
        topicId:topicId
      });
      this.client.post<any>('http://localhost:9090/reaction',this.reactionForm.value).subscribe(data=>{
        console.log(data)
        this.reactionForm.reset()
        this.getAllReactions()
      })
    }
    getAllTopics(){
      this.client.get<any>('http://localhost:9090/topic').subscribe(data=>{
        this.alltopic=data
        console.log(this.alltopic)
      })
    }
    getAllReactions(){
      this.client.get<any>('http://localhost:9090/reaction').subscribe(data=>{
        this.allReaction=data
        console.log(this.allReaction)
      })
    }
  ngOnInit(): void {
    this.user = this.authService.getUser();
    console.log(this.getAllTopics());
    console.log(this.getAllReactions());
    console.log(this.user);
  }
  private getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');   
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  }
}
