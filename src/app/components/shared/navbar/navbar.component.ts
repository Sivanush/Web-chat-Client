import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { Connections, User } from '../../../../interface/service/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isAddUser: boolean = false
  connections: User[] | null = null

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getAllConnections()
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
