import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { EmojiComponent, EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { UserService } from '../../service/user.service';
import { Subscription } from 'rxjs';
import { Message } from '../../../interface/service/chat.interface';
import { CloudinaryService } from '../../service/cloudinary.service';
import { ToasterService } from '../../service/toaster.service';
import { User } from '../../../interface/service/user.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, PickerComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;


  isGroup: boolean = false
  showEmojiPicker: boolean = false;
  message: string = ''
  messages: Message[] = []
  isEmojiToggle: boolean = false
  private isSending: boolean = false;
  private sendCooldown: number = 1500;
  receiverId: string | null = null
  userId!: string
  private messagesSubscription!: Subscription;
  private userStatusSubscription!: Subscription;
  private shouldScrollToBottom: boolean = false;
  isUploading: boolean = false;
  selectedFile: File | null = null;
  filePreview: string | null = null;
  selectedFileType: 'image' | 'video' | 'pdf' | null = null;
  isLoading: boolean = false;
  receiverData!:User 

  constructor(private chatService: ChatService, private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private cloudinaryService: CloudinaryService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId()
    this.chatService.joinChat(this.userId)
    this.chatService.setUserStatus(this.userId, 'online')


    this.messagesSubscription = this.chatService.messages$.subscribe({
      next: (messages) => {
        console.log(messages);

        this.messages = messages
        this.shouldScrollToBottom = true
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.chatService.getLatestMessage().subscribe({
      next: (res) => {
        this.messages.push(res)
      },
      error: (err) => {
        console.log(err);
      }
    })

    // console.log(this.messages);

    this.userStatusSubscription = this.chatService.userStatus$.subscribe({
      next: (status) => {        
        if (status && status.userId === this.receiverId) {
          this.receiverData.status = status.status;
        }
      },
      error: (err) => {
        console.error('Error getting user status:', err);
      }
    });

  }

  getReceiverData(userId: string){
    this.userService.getUserData(userId).subscribe({
      next: (res) => {
        this.receiverData = res
        this.chatService.getUserStatus(userId)
      },
      error: (err) => {
        console.log(err);
        this.toasterService.showError('Failed to get receiver data');
      }
    })
  }


  getReceiverId(event: string) {
    this.receiverId = event
    this.isLoading = true
    this.chatService.setUserStatus(this.userId, 'online')
    this.getReceiverData(this.receiverId)
    this.getAllMessages()
    console.log(this.messages);

  }

  getAllMessages(): void {
    this.chatService.getAllMessages(this.userId, this.receiverId as string)
    this.isLoading = false
  }

  toggleEmoji() {
    this.isEmojiToggle = !this.isEmojiToggle
  }

  async sendMessage() {
    if (this.isSending) {
      return;
    }
  
    if (this.selectedFile && this.selectedFileType) {
      try {
        this.message = '';
        this.isUploading = true;
        let uploadResult!: string;
  
        switch (this.selectedFileType) {
          case 'image':
            await this.toasterService.loadingToaster(this.cloudinaryService.uploadImage(this.selectedFile), 'Image Uploaded!')
              .then(data => uploadResult = data.url)
              .catch(err => console.log(err));
            break;
  
          case 'video':
            await this.toasterService.loadingToaster(this.cloudinaryService.uploadVideo(this.selectedFile), 'Video Uploaded!')
              .then(data => uploadResult = data.url)
              .catch(err => console.log(err));
            break;
  
          case 'pdf':
            await this.toasterService.loadingToaster(this.cloudinaryService.uploadImage(this.selectedFile), 'Document Uploaded!')
              .then(data => uploadResult = data.url)
              .catch(err => console.log(err));
            break;
        }
  
        this.chatService.sendMessage(uploadResult, this.userId, this.receiverId as string, this.selectedFileType)
  
        this.selectedFile = null;
        this.filePreview = null;
        this.selectedFileType = null;
        this.shouldScrollToBottom = true;
  
      } catch (error) {
        console.log(error);
      }
    }
  
    if (this.message.trim()) {
      this.isEmojiToggle = false;
      this.isSending = true;
  
      this.chatService.sendMessage(this.message, this.userId, this.receiverId as string);
      this.message = '';
      this.shouldScrollToBottom = true;
  
      setTimeout(() => {
        this.isSending = false;
      }, this.sendCooldown);
    }
  }
  

  addEmoji(event: { emoji: EmojiData }) {
    console.log(event);
    if (event && event.emoji && event.emoji.native) {
      if (this.message === '') {
        this.message = event.emoji.native
      } else {
        this.message += event.emoji.native
      }
    }
  }

  private scrollToBottom() {
    if (this.shouldScrollToBottom && this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        this.shouldScrollToBottom = false;
        this.changeDetectorRef.detectChanges();
      } catch (err) {
        console.error("Scroll error:", err);
      }
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }


  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
    this.chatService.setUserStatus(this.userId, 'offline');
    this.chatService.leaveRoom(this.userId);
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      this.selectedFile = file

      if (file.type.startsWith('image/')) {
        this.selectedFileType = 'image'
      } else if (file.type.startsWith('video/')) {
        this.selectedFileType = 'video'
      } else if (file.type === 'application/pdf') {
        this.selectedFileType = 'pdf'
      }

      const render = new FileReader();
      render.onload = () => {
        this.filePreview = render.result as string
      }
      render.readAsDataURL(file)
    }
  }
}
