import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { Connections, User } from '../../../../interface/service/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {


  @Output() receiverId = new EventEmitter<string>() 
  isAddUser: boolean = false
  connections: User[] | null = null

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllConnections()
  }

  emitTheReceiverId(userId:string): void {
    this.receiverId.emit(userId)
  }




  getAllConnections() {
    this.userService.getAllConnections().subscribe({
      next: (res) => {
        console.log(res);
        this.connections = res.connections
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
