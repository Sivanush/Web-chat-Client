import { Component } from '@angular/core';
import { GroupChatService } from '../../../service/group-chat.service';
import { Group } from '../../../../interface/service/group-chat.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSonnerToaster } from 'ngx-sonner';
import { ToasterService } from '../../../service/toaster.service';
import { UpdateGroupsService } from '../../../service/subject/update-groups.service';

@Component({
  selector: 'app-search-group',
  standalone: true,
  imports: [NgxSonnerToaster, FormsModule, CommonModule],
  templateUrl: './search-group.component.html',
  styleUrl: './search-group.component.scss'
})
export class SearchGroupComponent {
  groups!: Group[]
  input!: string
  isToaster = false
  private searchTimeout: number | undefined

  constructor(private groupService: GroupChatService,private toasterService:ToasterService,private updateGroupsService:UpdateGroupsService) {

  }

  joinedGroups = new Set()

  ngOnInit(): void {
    this.isToaster = true
  }



  searchGroups() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = window.setTimeout(() => {
      if (this.input.trim()) {
        this.groupService.searchGroups(this.input).subscribe({
          next: (res) => {
            console.log(res);
            this.groups = res;
          },
          error: (err) => {
            console.error('Error fetching users:', err);
          },
        });
      } else {
        this.groups = [];
      }
    }, 300);
  }

  onJoinGroup(groupId: string) {
    this.groupService.JoinGroup(groupId).subscribe({
      next:(result)=>{
        console.log(result);
        this.toasterService.showSuccess('Group Joined Successfully!')
        this.updateGroupsService.notifyUpdate()
      },
      error:(err)=>{
        console.log(err);
        this.toasterService.showError(err.error.message)
        this.updateGroupsService.notifyUpdate()
      }
    })
  }

  ngOnDestroy(): void {
    this.isToaster = false
  }
}
