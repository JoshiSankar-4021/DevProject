import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  private otherUser:any;
  constructor() { }
  setUser(userData:any){
    this.user = userData;
    sessionStorage.setItem('user',JSON.stringify(userData));
  }
  getUser(){
    return this.user||JSON.parse(sessionStorage.getItem('user')!)
  }
  logout(){
    this.user = null;
    sessionStorage.removeItem('user')
  }
  setOtherUser(userId:any){
    this.otherUser = userId
    sessionStorage.setItem('otherUser',JSON.stringify(userId))
  }
  getOtherUser(){
    return this.otherUser||JSON.parse(sessionStorage.getItem('otherUser')!)
  }
}
