import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Group, GroupChat } from '../../interface/service/group-chat.interface';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {

  private socket: Socket
  private serverUrl = environment.serverUrl

  private messagesSubject = new BehaviorSubject<GroupChat[]>([]);
  public messages$ = this.messagesSubject.asObservable();


  constructor(private http: HttpClient) { this.socket = io(environment.serverUrlSocket), this.setupSocketListeners() }

  private setupSocketListeners() {
    this.socket.on('newGroupMessage', (message: GroupChat) => {
      console.log('👍👍👍👍👍👍👍👍👍👍👍👍👍', message);
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });

    this.socket.on('allGroupMessages', (messages: GroupChat[]) => {
      console.log('✅✅✅✅✅✅✅✅✅', messages);
      this.messagesSubject.next(messages);
    });
  }


  searchGroups(input: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.serverUrl}/group-chat/s?input=${input}`)
  }

  createGroup(groupData: Group): Observable<Group[]> {
    return this.http.post<Group[]>(`${this.serverUrl}/group-chat/create`, groupData)
  }

  getMyGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.serverUrl}/group-chat/my-group`)
  }

  getGroupData(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.serverUrl}/group-chat/${groupId}`)
  }

  JoinGroup(groupId:string): Observable<Group>{
    return this.http.get<Group>(`${this.serverUrl}/group-chat/join/${groupId}`)
  }


  joinGroupRoom(groupId: string) {
    this.socket.emit('joinGroup', groupId);
  }

  leaveGroupRoom(groupId: string): void {
    this.socket.emit('leaveGroup', groupId);
  }


  getLatestGroupMessage(): Observable<GroupChat> {
    return new Observable<GroupChat>((observer) => {
      this.socket.on('newGroupMessage', (message: GroupChat) => {
        observer.next(message);
      });
    });
  }

  sendGroupMessage(content: string, sender: string, groupId: string, type?: string) {
    this.socket.emit('sendGroupMessage', { content, sender, groupId, type });
  }

  getGroupMessages(groupId: string) {
    this.socket.emit('getGroupMessages', groupId);
  }
}
