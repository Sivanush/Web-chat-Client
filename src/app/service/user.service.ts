import { Injectable } from '@angular/core';
import { CommonResponse, IUserAuthentication, User, UserAuthenticationResponse } from '../../interface/service/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrl = environment.serverUrl
  constructor(private http:HttpClient) { }


    userAuthentication(userData:IUserAuthentication):Observable<UserAuthenticationResponse>{
      return this.http.post<UserAuthenticationResponse>(`${this.serverUrl}/user/auth`,userData)
    }

    searchUsers(input:string):Observable<User[]>{
      return this.http.get<User[]>(`${this.serverUrl}/user/s/${input}`)
    }

    getRequest():Observable<CommonResponse>{
      return this.http.get<CommonResponse>(`${this.serverUrl}/user/get-requests`)
    }

    sendRequest(receiverId:string):Observable<CommonResponse>{
      return this.http.get<CommonResponse>(`${this.serverUrl}/user/send/${receiverId}`)
    }
}
