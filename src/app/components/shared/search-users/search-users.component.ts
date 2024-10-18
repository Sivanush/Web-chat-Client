import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { User } from '../../../../interface/service/user.interface';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../service/toaster.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-search-users',
  standalone: true,
  imports: [FormsModule,CommonModule,NgxSonnerToaster],
  templateUrl: './search-users.component.html',
  styleUrl: './search-users.component.scss'
})
export class SearchUsersComponent {
  isToaster = false;
  input!: string
  users: User[] = []
  private searchTimeout: number | undefined
  isLoading:boolean = false
  addedUsers = new Set<string>();

  constructor(private userService: UserService,private toasterService:ToasterService) {

  }


  ngOnInit(): void {
    this.isToaster = true

    this.userService.getSendRequest().subscribe({
      next:(res)=>{
        res.map((request)=>{
          this.addedUsers.add(request.receiver)
        })
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  

  ngOnDestroy(): void {
    this.isToaster = false;
  }


  

  onAddUser(user: User): void {
    if (!this.addedUsers.has(user._id)) {
      this.addedUsers.add(user._id);
      this.toasterService.loadingToaster(this.userService.sendRequest(user._id),'Request Sended!').catch((error)=>{
        console.log(error);
      })
    }
  }

  searchUsers() {
    this.isLoading = true
    clearTimeout(this.searchTimeout);

    this.searchTimeout = window.setTimeout(() => {
      if (this.input.trim()) {
        this.userService.searchUsers(this.input).subscribe({
          next: (res) => {
            this.isLoading = false
            this.users = res;
          },
          error: (err) => {
            console.error('Error fetching users:', err);
            this.isLoading = false
          },
        });
      } else {
        this.users = []; 
      }
    }, 300); 
  }
}












