import { Injectable } from '@angular/core';
import { CommonResponse, Connections, IUserAuthentication, RequestResponse, User, UserAuthenticationResponse } from '../../interface/service/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrl = environment.serverUrl
  constructor(private http:HttpClient) { }



  getUserId(){
    const token = localStorage.getItem('token');
    let decoded:{userId:string} = jwtDecode(token as string)
    return decoded.userId
  }








    userAuthentication(userData:IUserAuthentication):Observable<UserAuthenticationResponse>{
      return this.http.post<UserAuthenticationResponse>(`${this.serverUrl}/user/auth`,userData)
    }

    searchUsers(input:string):Observable<User[]>{
      return this.http.get<User[]>(`${this.serverUrl}/user/s/${input}`)
    }

    getRequest():Observable<RequestResponse[]>{
      return this.http.get<RequestResponse[]>(`${this.serverUrl}/user/get-requests`)
    }

    getSendRequest():Observable<RequestResponse[]>{
      return this.http.get<RequestResponse[]>(`${this.serverUrl}/user/get-send-requests`)
    }


    sendRequest(receiverId:string):Observable<CommonResponse>{
      return this.http.get<CommonResponse>(`${this.serverUrl}/user/send/${receiverId}`)
    }

    acceptOrReject(requestId:string,status:string):Observable<void>{
      return this.http.post<void>(`${this.serverUrl}/user/request`,{requestId,status})
    }

    getAllConnections():Observable<Connections>{
      return this.http.get<Connections>(`${this.serverUrl}/user/connections`)
    }

    getUserData(userId:string):Observable<User>{
      return this.http.get<User>(`${this.serverUrl}/user/user-data/${userId}`)
    }
}
