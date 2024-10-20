import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { SearchUsersComponent } from "./components/shared/search-users/search-users.component";
import { NotificationDialogComponent } from "./components/shared/notification-dialog/notification-dialog.component";
import { UserService } from './service/user.service';
import { ChatService } from './service/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, SearchUsersComponent, NotificationDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
  private userId: string | null = null;


  constructor(private userService: UserService, private chatService:ChatService) {}

  ngOnInit() {
    this.userId = this.userService.getUserId();
    if (this.userId) {
      window.onbeforeunload = () => {
        this.setUserOffline();
        return null;
      };
    }
  }


  ngOnDestroy() {
    window.onbeforeunload = null;
  }

  private setUserOffline() {
    if (this.userId) {

      // const data = JSON.stringify({ userId: this.userId, status: 'offline' });
      // navigator.sendBeacon('/api/set-user-status', data);

      this.chatService.setUserStatus(this.userId, 'offline');
    }
  }



}
