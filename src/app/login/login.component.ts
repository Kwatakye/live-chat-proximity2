import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ns-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.username.trim()) {
      // In a real app, you'd implement proper authentication here
      console.log('Logged in as:', this.username);
      this.router.navigate(['/chat-list']);
    } else {
      alert('Please enter a username');
    }
  }
}