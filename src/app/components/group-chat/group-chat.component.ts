import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GroupChatNavbarComponent } from "../shared/group-chat-navbar/group-chat-navbar.component";
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { FormsModule } from '@angular/forms';
import { Message } from '../../../interface/service/chat.interface';
import { ToasterService } from '../../service/toaster.service';
import { CloudinaryService } from '../../service/cloudinary.service';
import { GroupChatService } from '../../service/group-chat.service';
import { Group, GroupChat } from '../../../interface/service/group-chat.interface';
import { UserService } from '../../service/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-chat',
  standalone: true,
  imports: [CommonModule, RouterLink, GroupChatNavbarComponent, PickerComponent, FormsModule],
  templateUrl: './group-chat.component.html',
  styleUrl: './group-chat.component.scss'
})
export class GroupChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private isSending: boolean = false;
  private sendCooldown: number = 1500;
  message: string = ''
  isEmojiToggle: boolean = false
  groupId!: string
  userId: string = ''
  messages: GroupChat[] = []
  selectedFile: File | null = null;
  filePreview: string | null = null;
  selectedFileType: 'image' | 'video' | 'pdf' | null = null;
  isUploading: boolean = false
  private shouldScrollToBottom: boolean = false;
  groupData: Group | null = null
  private subscriptions: Subscription[] = [];

  constructor(private toasterService: ToasterService, private cloudinaryService: CloudinaryService, private changeDetectorRef: ChangeDetectorRef, private groupChatService: GroupChatService, private userService: UserService) { }


  ngOnInit(): void {
    this.userId = this.userService.getUserId()

    this.subscriptions.push(
      this.groupChatService.messages$.subscribe((messages: GroupChat[]) => {
        this.messages = messages;
        this.shouldScrollToBottom = true;
        this.changeDetectorRef.detectChanges(); // Trigger view update
      })
    );
    // Get initial messages

    // Subscribe to latest messages
    // this.subscriptions.push(
    //   this.groupChatService.getLatestGroupMessage().subscribe(message => {
    //     // Handle new message if needed separately from messages$
    //     console.log('New message received:', message);
    //     this.scrollToBottom();  
    //   })
    // );
  }

  ngOnDestroy(): void {
    if (this.groupId) {
      this.groupChatService.leaveGroupRoom(this.groupId);
    }
    
    if (this.subscriptions) {
      this.subscriptions.forEach((sub) => sub.unsubscribe())
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

  getGroupData(groupId: string) {
    this.groupChatService.getGroupData(groupId).subscribe({
      next: (data) => {
        this.groupData = data
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getGroupId(event: string) {
    if (this.groupId) {
      this.groupChatService.leaveGroupRoom(this.groupId);
    }
    this.groupId = event
    this.groupChatService.joinGroupRoom(this.groupId);
    this.getGroupData(this.groupId)
    this.groupChatService.getGroupMessages(this.groupId);
  }

  toggleEmoji() {
    this.isEmojiToggle = !this.isEmojiToggle
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

        this.groupChatService.sendGroupMessage(uploadResult, this.userId, this.groupId, this.selectedFileType)

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

      this.groupChatService.sendGroupMessage(this.message, this.userId, this.groupId);
      this.message = '';
      this.shouldScrollToBottom = true;

      setTimeout(() => {
        this.isSending = false;
      }, this.sendCooldown);
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
}
