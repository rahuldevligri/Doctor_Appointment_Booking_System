import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/services/user/user';
import { ContentObserver } from '@angular/cdk/observers';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: User | null = null;
  username: string | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.username = this.userService.getUserName();
    this.userService.getUserProfile().subscribe(
      (response) => {
        console.log('User Profile:', response);
        this.userProfile = response;
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }
}