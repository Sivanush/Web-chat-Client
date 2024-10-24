import { Component, ElementRef, ViewChild } from '@angular/core';
// import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { ToasterService } from '../../service/toaster.service';
import { IUserAuthentication } from '../../../interface/service/user.interface';

declare var google: {
  accounts: {
    id: {
      initialize: (options: {
        auto_select: boolean;
        client_id: string;
        callback: (response: GoogleResponse) => void;
      }) => void;
      renderButton: (element: HTMLElement, options: {
        theme: string;
        size: string;
        shape: string;
        text: string;
        width: string;
        type: string;
      }) => void;
    };
  };
};


interface GoogleResponse {
  credential: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, AsyncPipe],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  constructor(public router: Router, private userService: UserService, private toasterService: ToasterService) {

  }

  ngOnInit(): void {
    const clientId = '765106197171-9tbkjqu9g1om8pfi14jbq09bs6goom5m.apps.googleusercontent.com'


    const loadGoogleButton = () => {
      google.accounts.id.renderButton(
        document.getElementById('google-btn') as HTMLElement, {
        theme: 'outline',
        size: 'medium',
        shape: 'rectangle',
        text: 'continue_with',
        width: '500px',
        type: 'standard',
      });
    };

    google.accounts.id.initialize({
      auto_select: false,
      client_id: clientId,
      callback: (res: GoogleResponse) => {
        console.log(res)
        this.handleAuth(res)
      }
    });


  

    // google.accounts.id.renderButton(
    //   document.getElementById('google-btn') as HTMLElement, {
    //   theme: 'outline',
    //   size: 'medium',
    //   shape: 'rectangle',
    //   text: 'continue_with',
    //   width: '500px',
    //   type: 'standard',
    // }
    // );

    const checkGoogleButton = () => {
      if (document.getElementById('google-btn')) {
        loadGoogleButton();
      } else {
        console.error('Google button not found, retrying...');
        setTimeout(checkGoogleButton, 1000); 
      }
    };
  
    checkGoogleButton()


  }

  handleAuth(res: GoogleResponse) {
    if (res && res.credential) {
      let payload = this.decodeToken(res.credential)
      console.log(payload);
      const userData: IUserAuthentication = {
        name: payload.name,
        email: payload.email,
        image: payload.picture
      };

      this.toasterService.loadingToaster(this.userService.userAuthentication(userData), 'Welcome Back!').then((res) => {
        console.log(res);
        localStorage.setItem('token',res.token)
        this.router.navigate(['chat'])
      })
        .catch((err) =>
          console.log(err)
        )
    }
  }

  private decodeToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

}
