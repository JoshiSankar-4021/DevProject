import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Console, error } from 'node:console';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  form:FormGroup;
  formData:any[]=[];
  id: any;
  dbskills:any[]=[];
  dbEducation:any[]=[];
  isHandicapped:any=false;
  agedesc:any;
  selectedFile!: File;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  otheradditionalFiles: any[] = [];
  otherSelectedFiles:any[]=[];
  constructor(formBuilder:FormBuilder,private client:HttpClient,private authService: AuthService){
    this.form=formBuilder.group({
      id:new FormControl(),
      profileImage:new FormControl(),
      firstName:new FormControl('', Validators.required),
      lastName:new FormControl(''),
      phnum:new FormControl('',Validators.pattern('^[0-9]{10}$')),
      email:new FormControl('', [Validators.required, Validators.email]),
      address:new FormControl(),
      password:new FormControl('', [Validators.required, Validators.minLength(4)]),
      gender:new FormControl(),
      physicallyHandicaped:new FormControl(false),
      legalIssues:new FormControl(false),
      dob:new FormControl('', Validators.required),
      age:new FormControl(),
      education:new FormControl(),
      profileImagePath:new FormControl(),
      additionalFiles:new FormControl()
    })
  }
  ngOnInit(): void {
    this.id = this.authService.getUser()
    this.update(this.id)
    this.getFiles()
    console.log(this.id)
    this.getAllEducation()
  }
  update(id:any){
    this.client.get<any>('http://localhost:9090/register/'+id).subscribe(data=>{
      if (data.profileImagePath) {
        this.fetchProfileImage(data.profileImagePath);
      }
      this.form.setValue(data)
      this.ageCalculation()
      console.log(data)
    })
  }
  save(userID: any): void {
    const formData = new FormData();
      formData.append(
      'registration',
      new Blob([JSON.stringify(this.form.value)], { type: 'application/json' })
    );
      if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }
    this.otherSelectedFiles.forEach((file: File) => {
      formData.append('additionalFiles', file);
    });
      this.client.put<any>(`http://localhost:9090/register/${userID}`, formData).subscribe(
      (data) => {
        console.log('Update successful:', data)
        this.update(userID) 
        this.getAllEducation()
        this.getFiles()
        this.otherSelectedFiles = [];
      },
      (error) => {
        console.error('Update failed:', error);
        this.update(userID) 
        this.getAllEducation()
        this.getFiles()
        this.otherSelectedFiles = [];
      }
    );
  }
  getSkills(){
    this.client.get<any>('http://localhost:9090/skill').subscribe(
      data=>{
        console.log(data)
        for(var i=0;i<data.length;i++){
          this.dbskills=data[i];
        }
      }
    )
  }
  getId(){
    console.log(this.form.value.education);
    this.save(this.id)
  }
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.save(this.id)
    }
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
       const lastMonth = new Date(currdate.getFullYear(), currdate.getMonth(), 0);
       days += lastMonth.getDate(); 
       months--;
     }
     if(years<0){
      years=0;
     }
     console.log(years);
     console.log(months);
     console.log(days);
     this.form.value.age=years;
     this.agedesc=`${years} years, ${months} months, ${days} days`;
   }
  fetchProfileImage(imagePath: string): void {
    this.client.get(`http://localhost:9090/register/profile-image/${this.id}`, { responseType: 'arraybuffer' }).subscribe((response: ArrayBuffer) => {
      const imageBlob = new Blob([response], { type: 'image/png' }); 
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(imageBlob);
    }, error => {
      console.error('Error fetching image:', error);
    });
  }

  getFiles(): void {
    const userId = this.id;  
    this.client.get<any[]>(`http://localhost:9090/${userId}/files`).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.otheradditionalFiles = response;
          console.log('Files fetched successfully:', response);
        } else {
          console.warn('No additional files found');
          this.otheradditionalFiles = [];
        }
      },
      (error) => {
        console.error('Error fetching additional files:', error);
      }
    );
  }
  getAllEducation(){
    return this.client.get<any>('http://localhost:9090/education').subscribe(
      data => {
        console.log(data);
        this.dbEducation = data;
      },
      error => {
        console.error('Error fetching education data:', error);
      }
    );
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
  deleteFile(id: any, filePath: any) {
    console.log(id)
    console.log(filePath)
    const encodedFilePath = encodeURIComponent(filePath);
    this.client
      .delete<any>(`http://localhost:9090/${id}`, {
        params: { filePath: encodedFilePath },
      })
      .subscribe(
        (data) => {
          console.log(`Deleted file with ID: ${id}`);  
          this.getFiles()
        },
        (error) => {
          console.error('Error while deleting file:', error);
        }
      );
  }
  reloadPage() {
    window.location.reload();
  }
  downloadFile(fileName:any){
    this.client.get<any>(`http://localhost:9090/download/${fileName}`,{responseType:'blob' as 'json'}).subscribe({
      next:(blob:Blob)=>{
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href=fileURL;
        anchor.download = fileName;
        anchor.click();
        window.URL.revokeObjectURL(fileURL);
      },
      error:(error)=>{
        console.error('Error downloading file:', error);
          alert('Failed to download the file.');
      },
    });
  }

  onDateChange(event:any){
    this.ageCalculation();
    this.save(this.id);
  }
}


