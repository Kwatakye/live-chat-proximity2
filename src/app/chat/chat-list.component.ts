import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'ns-chat-list',
  templateUrl: './chat-list.component.html',
})
export class ChatListComponent implements OnInit {
  nearbyUsers: any[] = [];

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.scanForNearbyUsers();
  }

  scanForNearbyUsers() {
    const MAX_DISTANCE = 45.72; // 150 feet in meters
    this.nearbyUsers = this.userService.getNearbyUsers(MAX_DISTANCE);
  }

  onUserTap(userId: string) {
    this.router.navigate(['/chat-room', userId]);
  }
}