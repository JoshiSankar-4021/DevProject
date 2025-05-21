import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-opinion',
  templateUrl: './my-opinion.component.html',
  styleUrls: ['./my-opinion.component.css']  // fixed typo here from 'styleUrl' to 'styleUrls'
})
export class MyOpinionComponent implements OnInit {
  id: any;
  reactionId: number | null = null;  // null means no edit mode
  userComments: any[] = [];
  reactionForm: FormGroup;
  days: number = 0;
  months: number = 0;
  years: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private client: HttpClient,
    private authService: AuthService
  ) {
    this.reactionForm = this.formBuilder.group({
      id: new FormControl(null),
      comment: new FormControl(''),
      userId: new FormControl(null),
      topicId: new FormControl(null),
      date: new FormControl(this.getCurrentDate())
    });
  }

  ngOnInit(): void {
    this.id = this.authService.getUser();
    this.loadUserComments(this.id);
  }

  loadUserComments(userId: any) {
    this.client.get<any[]>(`http://localhost:9090/reaction/${userId}`).subscribe(data => {
      this.userComments = data;
      console.log(this.userComments);
    });
  }

  edit(editId: any) {
    this.client.get<any>(`http://localhost:9090/reaction/data/${editId}`).subscribe(data => {
      this.reactionForm.patchValue(data); // use patchValue for partial updates
      this.reactionId = data.id;           // set the reactionId to data.id for update
      this.AgeCalculation(new Date(data.date));
    });
  }

  addComment(topicId: number) {
    if (!this.reactionForm.value.comment) {
      alert('Comment cannot be empty');
      return;
    }
    this.reactionForm.patchValue({
      userId: this.id,
      topicId: topicId,
      date: this.getCurrentDate()
    });

    this.client.post<any>('http://localhost:9090/reaction', this.reactionForm.value).subscribe(data => {
      console.log('Added:', data);
      this.AgeCalculation(new Date(data.date));
      this.loadUserComments(this.id);
      this.clearForm();
    });
  }

  update() {
    if (!this.reactionForm.value.comment) {
      alert('Comment cannot be empty');
      return;
    }

    if (!this.reactionId) {
      alert('No comment selected to update');
      return;
    }

    this.reactionForm.patchValue({ userId: this.id });

    this.client.put(`http://localhost:9090/reaction/${this.reactionId}`, this.reactionForm.value)
      .subscribe(() => {
        console.log('Updated successfully');
        this.loadUserComments(this.id);
        this.clearForm();
      });
  }

  delete(deleteId: any) {
    this.client.delete(`http://localhost:9090/reaction/${deleteId}`).subscribe(() => {
      console.log('Deleted comment');
      this.loadUserComments(this.id);
    });
  }

  onDelete(commentId: any) {
    if (confirm('Do you want to delete?')) {
      this.delete(commentId);
    }
  }

  clearForm() {
    this.reactionId = null;
    this.reactionForm.reset({
      date: this.getCurrentDate()
    });
    this.days = 0;
    this.months = 0;
    this.years = 0;
  }

  private getCurrentDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private AgeCalculation(date: Date) {
    const today = new Date();
    this.years = today.getFullYear() - date.getFullYear();
    this.months = today.getMonth() - date.getMonth();
    this.days = today.getDate() - date.getDate();

    if (this.days < 0) {
      this.months--;
      this.days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (this.months < 0) {
      this.years--;
      this.months += 12;
    }

    console.log(`Age: ${this.years} years, ${this.months} months, ${this.days} days`);
  }
}
