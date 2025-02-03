import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bulk-records',
  templateUrl: './bulk-records.component.html',
  styleUrl: './bulk-records.component.css'
})
export class BulkRecordsComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
      constructor(private client:HttpClient,private toastr: ToastrService){}

      onFileSelected(event: any): void {
        if (event.target.files.length > 0) {
          this.selectedFile = event.target.files[0];
          console.log('Selected file:', this.selectedFile);
        }
      }
      onUpload(): void {
        if (!this.selectedFile) return;
      
        const formData = new FormData();
        formData.append('excelFile', this.selectedFile);
      
        this.isUploading = true;
        this.client.post('http://localhost:9090/register/excelFile', formData).subscribe({
          next: (response) => {
            const res = response as { message: string; statusCode: number };
            console.log('Upload successful:', res.message);
            this.isUploading = false;
            this.selectedFile = null;

            if (response && res.message) {
              this.showToast("upload sucessful"+ res.message)
              //  alert('Upload successful: ' + res.message);
            } 
          },error: (error) => {
            console.error('Upload failed:', error);
            
            let errorMessage = 'An error occurred while uploading the file.';
            try {
              if (error.error && typeof error.error === 'object' && error.error.message) {
                errorMessage = JSON.stringify(error.error.message); 
              } 
            } catch (e) {
              errorMessage = 'Error parsing server response.';
            }
           // alert('Upload failed: ' + errorMessage);
           this.showErrorToast("upload failde:"+errorMessage)
            this.isUploading = false;
          }
        });
        
      }          
      showToast(message: string) {
        this.toastr.success(message, 'Success', {
          timeOut: 10000, 
          positionClass: 'toast-top-center',
          closeButton: true,
        });
      }

      showErrorToast(message: string) {
        this.toastr.error(message, 'Error', {
          timeOut: 10000,
          positionClass: 'toast-top-center',
          closeButton: true,
          
        });
      }
}

