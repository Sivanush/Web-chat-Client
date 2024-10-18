import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket:Socket
  constructor() {
      this.socket = io(environment.serverUrlSocket)
   }

   getLatestMessage(){
     return new Observable((obs)=>{
      this.socket.on('newMessage',(message:string)=>{
        obs.next(message)
      })
     })
   }

   sendMessage(message:string){
    this.socket.emit('sendMessage',message)
   }

   ngOnDestroy(): void {
    this.socket.disconnect()    
   }
}
