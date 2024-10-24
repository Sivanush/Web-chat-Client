import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxSonnerToaster } from 'ngx-sonner';

import { Group } from '../../../../interface/service/group-chat.interface';
import { CommonModule } from '@angular/common';
import { GroupChatService } from '../../../service/group-chat.service';
import { ToasterService } from '../../../service/toaster.service';
import { CloudinaryService } from '../../../service/cloudinary.service';
import { GroupChatNavbarComponent } from '../group-chat-navbar/group-chat-navbar.component';
import { UpdateGroupsService } from '../../../service/subject/update-groups.service';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [NgxSonnerToaster, FormsModule, CommonModule],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  @Input() isToaster = false;
  isUploading: boolean = false
  imagePreview: string = ''
  selectedImage: File | null = null

  ngOnInit(): void {
    this.isToaster = true
  }

  ngOnDestroy(): void {
    this.isToaster = false
  }

  newGroup: Group = {
    name: '',
    description: '',
    image: ''
  }

  constructor(
    private groupService: GroupChatService,
    private toastService: ToasterService,
    private cloudinaryService: CloudinaryService,
    private updateGroupsService:UpdateGroupsService
  ) { }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Create a preview
      this.selectedImage = file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onCreateGroup() {
    if (this.newGroup.name.trim().length < 3 || this.newGroup.description.trim().length < 3) {
      this.toastService.showWarn('Fill all the required fields properly')
      return;
    }
    try {

      if (this.imagePreview) {
        console.log(this.selectedImage);
        this.isUploading = true;

        const res = await this.cloudinaryService.uploadImage(this.selectedImage as File).toPromise();
        if (res) {
          this.newGroup.image = res.url;
          console.log('✅ Image uploaded:', res.url);
        } else {
          this.newGroup.image = undefined
        }
        this.isUploading = false;
      } else {
        this.newGroup.image = undefined
        this.isUploading = false;
      }
      this.toastService.loadingToaster(this.groupService.createGroup({ ...this.newGroup, _id: undefined }), 'Group created successfully!').then((res) => {
        console.log(res);
        document.getElementById('create_group_close_btn')?.click()
        this.resetForm();
        this.imagePreview = ''
        this.selectedImage = null
        this.updateGroupsService.notifyUpdate()
      }).catch((error) => {
        console.log(error)
      })

      // this.groupService.createGroup({...this.newGroup,_id : undefined}).subscribe({
      //   next: (response) => {
      //     console.log(response);
      //     this.toastService.showSuccess('Group created successfully!');
      //     document.getElementById('create_group_close_btn')?.click()
      //     this.resetForm();
      //     this.imagePreview = ''
      //     this.selectedImage = null
      //   },
      //   error: (error) => {
      //     this.toastService.showError(error.error.message);
      //     console.error('Error creating group:', error);
      //   }
      // });
    } catch (error) {
      console.log(error);

    }
  }

  private resetForm() {
    this.newGroup = {
      _id: '',
      name: '',
      description: '',
      image: ''
    };
  }
}
