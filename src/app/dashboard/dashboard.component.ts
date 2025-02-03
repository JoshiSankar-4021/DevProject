import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
tabs=[ { id: 'profile', label: 'Profile' },
  // { id: 'createtopic', label: 'Create Topic' },
  // { id: 'reactions', label: 'Reactions' },
  // { id: 'myOpinion', label: 'My Opinion' },
  { id: 'bulk', label: 'Bulk' },
  { id: 'allusers', label: 'All Users' }]
activeTab: string='profile';
setActiveTab(tab: string) {
    this.activeTab=tab;
}

}
