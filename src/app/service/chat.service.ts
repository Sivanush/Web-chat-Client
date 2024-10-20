import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../interface/service/chat.interface';


interface UserStatus {
  userId: string;
  status: 'online' | 'offline';
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private userStatusSubject = new BehaviorSubject<UserStatus | null>(null);
  public userStatus$ = this.userStatusSubject.asObservable();

  private socket: Socket
  constructor() {
    this.socket = io(environment.serverUrlSocket)
    this.setupSocketListeners()
  }



  private setupSocketListeners() {
    this.socket.on('newMessage', (message: Message) => {
      const currentMessages = this.messagesSubject.value
      this.messagesSubject.next([...currentMessages, message])
    })

    this.socket.on('allMessages', (messages: Message[]) => {
      this.messagesSubject.next(messages);
    });

    this.socket.on('userStatusChanged', (status: UserStatus) => {
      this.userStatusSubject.next(status);
    });

    this.socket.on('userStatus', (status: UserStatus) => {
      console.log('✅✅✅✅✅✅✅✅✅✅');
      
      this.userStatusSubject.next(status);
    });
  }

  joinChat(userId: string){
    this.socket.emit('joinChat',userId)
  }


  getLatestMessage(): Observable<Message> {
    return new Observable<Message>((obs) => {
      this.socket.on('newMessage', (message: Message) => {
        obs.next(message)
      })
    })
  }

  sendMessage(content:string, sender:string, receiver:string, type?:string) {
    this.socket.emit('sendMessage', { content, sender, receiver , type })
  }

  getAllMessages(sender: string, receiver: string) {
    return this.socket.emit('getAllMessages', { sender, receiver })
  }

  setUserStatus(userId: string, status: 'online' | 'offline') {
    this.socket.emit('setUserStatus', { userId, status });
  }
  
  leaveRoom(userId: string) {
    this.socket.emit('leaveChat', userId);
  }

  getUserStatus(userId: string) {
    this.socket.emit('getUserStatus', userId);
  }


  // ngOnDestroy(): void {
  //   this.socket.disconnect()
  // }
}
