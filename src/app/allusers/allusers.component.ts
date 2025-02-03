import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrl: './allusers.component.css'
})
export class AllusersComponent {
  usersdata:any[]=[]
  paginaationUsers: any[] = [];
  currentPage: number = 0;
  pageSize: any = 9;
  sort='id';
  direction='asc';
  totalPages: number = 0; 
  searchKeyword: string = '';
    constructor(private client:HttpClient,private authService:AuthService,private router:Router){}
   
    ngOnInit(): void {
     this.getAllUsers()
  }
  getAllUsers(){
    let params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString())
      .set('sort', this.sort)
      .set('direction', this.direction);
      if(this.searchKeyword){
       params= params.set('keyword', this.searchKeyword);
       console.log(this.searchKeyword)
      }
    this.client.get<any>(`http://localhost:9090/register/users`,{ params }).subscribe(data=>{
      console.log(data);
      this.paginaationUsers=data.content;
      this.totalPages=data.totalPages;
    })
  }
  goToPage(page:number){
    if(page>=0 && page<this.totalPages){
      this.currentPage=page;
    }
  }
  nextPage(){
    if(this.currentPage<this.totalPages-1){
      this.goToPage(this.currentPage+1);
      this.getAllUsers();
    }
  }
  previousPage(){
    if(this.currentPage>0){
      this.goToPage(this.currentPage-1); 
      this.getAllUsers();
    }
  }
  changeSort(column: string): void {
    this.sort = column;
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    this.getAllUsers();
  }
  onSearch(): void {
    this.currentPage = 0;
    this.getAllUsers();
  }
  edit(userId:any){
    console.log(userId)
    this.authService.setOtherUser(userId)
    this.router.navigate(['/userprofile'])
  }
  delete(userId:any){
    let x=confirm("Are you sure want to delete user all related files of user will be deleted")
    if(x){
      this.client.delete<any>(`http://localhost:9090/register/user/`+userId).subscribe(data=>{
        console.log(userId+` deleted`)
        this.getAllUsers()
      })
    }
  }
}
