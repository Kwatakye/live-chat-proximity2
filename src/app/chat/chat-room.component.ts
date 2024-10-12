import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-chat-room',
  templateUrl: './chat-room.component.html',
})
export class ChatRoomComponent implements OnInit {
  userId: string;
  messages: any[] = [];
  newMessage: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, incoming: false });
      this.newMessage = '';
      
      // Simulate receiving a response
      setTimeout(() => {
        this.messages.push({ text: 'This is a simulated response', incoming: true });
      }, 1000);
    }
  }
}