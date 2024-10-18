import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSonnerToaster } from 'ngx-sonner';
import { UserService } from '../../../service/user.service';
import { CommonModule } from '@angular/common';
import { RequestResponse } from '../../../../interface/service/user.interface';
import { ToasterService } from '../../../service/toaster.service';

@Component({
  selector: 'app-notification-dialog',
  standalone: true,
  imports: [NgxSonnerToaster,FormsModule,CommonModule],
  templateUrl: './notification-dialog.component.html',
  styleUrl: './notification-dialog.component.scss'
})
export class NotificationDialogComponent {
  isToaster = false
  requests!:RequestResponse[]

  constructor(private userService: UserService, private toasterService:ToasterService) {}

  ngOnInit(): void {
    this.isToaster = true;
    this.getRequest()
  }


  getRequest(){
    this.userService.getRequest().subscribe({
      next:(data) => {
        this.requests = data
        console.log(this.requests);
      },
      error:(err) => {
        console.log(err);
      },
    })
  }


  acceptorReject(requestId: string, status: string) {
    this.userService.acceptOrReject(requestId, status).subscribe({
      next: () => {
        if (status === 'accepted') {
          this.toasterService.showSuccess('Request accepted successfully!');
        } else if (status === 'rejected') {
          this.toasterService.showWarn('Request rejected!');
        }
        this.getRequest()
      },
      error: (err) => {
        console.log(err);
        this.toasterService.showError(err.error.message);
      }
    });
  }
  

  ngOnDestroy(): void {
    this.isToaster = false;
  }
}
