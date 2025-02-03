import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Console } from 'console';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
onSkillsSelectionChange($event: Event) {
throw new Error('Method not implemented.')
}
  form:FormGroup;
  registerdata:any[]=[]
  phoneNum:string=""
  dbskills:any[]=[]
  dbEducation:any[]=[]
  isHandicapped:any=false
  agedesc:any
  selectedFile!: File
  imagePreviewUrl: string | ArrayBuffer | null = null
  otherSelectedFiles:any[]=[];
  firstNamerequired:boolean=false
  emailrequired:boolean=false
  passwordrequired:boolean=false
  dobrequired:boolean=false
  emailformat:boolean=false
  maxDate:Date= new Date()
  emailRegistered:boolean=false

  constructor(formBuilder:FormBuilder,private client:HttpClient,private router:Router){
    this.form=formBuilder.group({
      id:new FormControl('', Validators.required),
      firstName:new FormControl(),
      lastName:new FormControl(),
      email:new FormControl(),
      phnum:new FormControl(),
      address:new FormControl(),
      password:new FormControl(),
      gender:new FormControl(),
      physicallyHandicaped:new FormControl(false),
      legalIssues:new FormControl(false),
      dob:new FormControl(),
      age:new FormControl(),
      education:new FormControl(), 
    })
  }
  saves(){
    console.log(this.form.value);
    this.form.reset()
  }
  save(){
    console.log(this.form.value);
    this.client.post<any>('http://localhost:9090/register/savewithoutProfile',this.form.value).subscribe(
      data=>{console.log(data)
        //this.form.reset()  
        this.router.navigate(['login'])
  });
  }
  validation(){
    this.phoneNum=this.form.value.phoneNum;
    console.log(this.form.value)
    if(this.form.value.firstName==null||this.form.value.lastName==null||
      this.form.value.phnum==null||this.form.value.address==null||this.form.value.password==null
    ){
      console.log(this.form.value)
      alert('Please Fill all details')
    }else{
      this.save()
    }
  }
  getSkills(){
    this.client.get<any>('http://localhost:9090/skill').subscribe(
      data=>{
        console.log(data)
       this.dbskills=data
       console.log(this.dbskills)
      }
    )
  }
  getEducation(){
    this.client.get<any>('http://localhost:9090/education').subscribe(data=>{
      console.log(data)
      this.dbEducation=data;
    })
  }
  ngOnInit(): void {
      this.getSkills()
      this.getEducation()
  }
  ageCalculation(){
   console.log( this.form.value.dob)
   let dobDate = new Date(this.form.value.dob);
   const currdate = new Date();
    let years  = currdate.getFullYear()-dobDate.getFullYear();
    let months = currdate.getMonth()-dobDate.getMonth();
    let days   = currdate.getDay()-dobDate.getDay();
    if(months<0){
      months+=12;
      years--;
    }
    if(days<0){
      const lastMonth = new Date(currdate.getFullYear(), currdate.getMonth(), 0)
      days += lastMonth.getDate()
      months--;
    }
    console.log(years);
    console.log(months);
    console.log(days);
    this.form.value.age=years;
    this.agedesc=`${years} years, ${months} months, ${days} days`
  }
  getId(){
    console.log(this.form.value.education);
  }
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onRegister(): void {
    const formData = new FormData();
    formData.append('registration', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' }));
    formData.append('profileImage', this.selectedFile);
    this.otherSelectedFiles.forEach((file: File) => {
      formData.append('additionalFiles', file);
    });
   
    this.client.post<any>('http://localhost:9090/register', formData).subscribe({
      next: (data) => {
        console.log('Registration successful:', data);
        this.form.reset();
        let x = confirm('User Sucessfully Registered! click on ok to move to Login Page ')
        if(x){
          this.router.navigate(['/']);
        }
        
      },
      error: (error) => {
        if (error.status === 500) { 
          this.emailRegistered=true
        } else {
          console.error('An unexpected error occurred:', error);
          alert('An error occurred while registering. Please try again later.');
        }
      },
    });
  }

  onAdditionalFilesSelected(event:any){
    if (event.target.files.length > 0) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.otherSelectedFiles.push(event.target.files[i]);
      }
    }
  }
  
  removeselectedFile(index:number,inputElement: HTMLInputElement):void{
    this.otherSelectedFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
     this.otherSelectedFiles.forEach(file => {
    dataTransfer.items.add(file);
  });
  inputElement.files = dataTransfer.files;
  }
  
  checkValidation(){
    if(this.form.value.firstName==null){
      this.firstNamerequired=true
    }else{
      this.firstNamerequired=false
    }
    if(this.form.value.email==null){
      this.emailrequired=true
    }else{
      this.emailrequired=false
    }
    if(this.form.value.password==null){
      this.passwordrequired=true
    }else{
      this.passwordrequired=false
    }
    if(this.form.value.dob==null){
      this.dobrequired=true;
    }else{
      this.dobrequired=false;
    }
    if(!this.form.value.email.includes('@')){
      this.emailformat=true;
      console.log(this.emailformat)
    }else{
      this.emailformat=false;
      console.log(this.emailformat)
    }
    if(!this.firstNamerequired && !this.emailrequired && !this.emailformat && !this.passwordrequired && !this.dobrequired){
      this.onRegister();
    }
  }
  handle(){
    if(this.firstNamerequired){
      this.firstNamerequired=false
    }
    if(this.passwordrequired){
      this.passwordrequired=false
    }
    if(this.dobrequired){
      this.dobrequired=false
    }
    if(this.emailrequired){
      this.emailrequired=false
    }
    if(!this.form.value.email.includes('@')){
      if(!this.emailrequired){
        this.emailformat=true;
      }
    }else if(this.form.value.email.includes('@')){
      this.emailformat=false;
    }
    if(this.dobrequired){
      this.dobrequired=false;
    }
    if(this.passwordrequired){
      this.passwordrequired=false
    }
  }
}


