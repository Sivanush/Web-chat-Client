import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../../interface/service/group-chat.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  constructor(private http: HttpClient) { }

  private serverUrl = environment.serverUrl




  searchGroups(input: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.serverUrl}/group-chat/s?input=${input}`)
  }

  createGroup(groupData: Group) {
    return this.http.post<Group[]>(`${this.serverUrl}/group-chat/create`, groupData)
  }

  getMyGroups(){
    return this.http.get<Group[]>(`${this.serverUrl}/group-chat/my-group`)
  }





  sendMessage(content: string, userId: string, groupId: string, type?: string) {

  }
}
