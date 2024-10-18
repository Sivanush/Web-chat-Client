import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { EmojiComponent, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent,PickerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  isGroup:boolean = false
  showEmojiPicker: boolean = false;
  message:string = ''
  messages:any[] = []
  isEmojiToggle:boolean = false
  private isSending: boolean = false;
  private sendCooldown: number = 1500;

  constructor(private chatService:ChatService) {}
  

  // @HostListener

  ngOnInit(): void {
    this.chatService.getLatestMessage().subscribe({
      next:(res)=>{
        this.messages.push(res)
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  toggleEmoji(){
    this.isEmojiToggle = !this.isEmojiToggle
  }

  sendMessage(){
    if (this.isSending) {
      return
    }
    
    if (this.message.trim()) {
      this.isEmojiToggle = false
      this.isSending = true
      this.chatService.sendMessage(this.message)
      this.message = ''
      setTimeout(() => {
        this.isSending = false
      }, this.sendCooldown);
    }
  }

  addEmoji(event:{emoji:EmojiData}){
    console.log(event);
   if (event && event.emoji && event.emoji.native) {
      if (this.message === '') {
        this.message = event.emoji.native
      }else{
        this.message += event.emoji.native
      }
   }
  }
}
