import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ok } from 'node:assert';

@Component({
  selector: 'app-my-opinion',
  templateUrl: './my-opinion.component.html',
  styleUrl: './my-opinion.component.css'
})
export class MyOpinionComponent {
id:any
reactionId:number=0
userComments:any[]=[]
reactionForm:FormGroup
days:any=0
months:any=0
years:any=0
constructor(private formBuileder:FormBuilder,private client:HttpClient,private authService:AuthService){
  this.reactionForm=formBuileder.group({
    id:new FormControl(),
    comment:new FormControl(),
    userId:new FormControl(),
    topicId:new FormControl(),
    date:new FormControl(),
    hobby:new FormControl()
  })    
  }
  ngOnInit(): void {
    this.id = this.authService.getUser(); 
    this.allUserComments(this.id);
    console.log(this.id);
  }
  allUserComments(userid:any){
    this.client.get<any>('http://localhost:9090/reaction/'+userid).subscribe(data=>{
      this.userComments=data
      console.log(this.userComments)
    })
  }
  edit(editid:any){
    this.client.get<any>('http://localhost:9090/reaction/data/'+editid).subscribe(
      data=>{
        this.reactionForm.setValue(data);
        this.reactionId=data.topicId
      }
    )}
    delete(deleteid:any){
      this.client.delete<any>('http://localhost:9090/reaction/'+deleteid).subscribe(
        data=>{
           console.log("deleted on comment"),
           this.allUserComments(this.id)
        }
      )} 
      addComment(topicId:number){
        console.log(topicId),
        this.reactionForm.patchValue({
          userId: this.id ? this.id : null,
          topicId:topicId
        });
        this.client.post<any>('http://localhost:9090/reaction',this.reactionForm.value).subscribe(data=>{
          console.log(data),
          this.AgeCalculation(data.date);
          this.allUserComments(this.id)
        })
        
      } 
  update(dataId:any){
    this.addComment(dataId)
    this.reactionForm.reset()
  }
  private getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');   
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  }
  private AgeCalculation(date:Date){
    let today = new Date();
   this.years=today.getFullYear()-date.getFullYear()
   this.months=today.getMonth()-date.getMonth()
   this.days = today.getDay()-date.getDay()
    console.log(this.years)
    console.log(this.months)
    console.log(today)
    console.log(date)
  }
  onDelete(commentid:any){
    let a=confirm("Do you want to delete");
    if(a=true){
      this.delete(commentid)
    }
  }
}
 