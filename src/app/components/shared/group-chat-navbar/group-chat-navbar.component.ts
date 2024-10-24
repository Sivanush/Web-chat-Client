import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GroupChatService } from '../../../service/group-chat.service';
import { Group } from '../../../../interface/service/group-chat.interface';
import { UpdateGroupsService } from '../../../service/subject/update-groups.service';

@Component({
  selector: 'app-group-chat-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './group-chat-navbar.component.html',
  styleUrl: './group-chat-navbar.component.scss'
})
export class GroupChatNavbarComponent {

  groups:Group[] | null = null
  @Output() groupId = new EventEmitter<string>() 


  constructor(
    private groupService:GroupChatService,
    private updateGroupsService:UpdateGroupsService
  ) {}

  ngOnInit(): void {
    this.getMyGroups()

    this.updateGroupsService.groupUpdate$.subscribe(()=>{
      this.getMyGroups()
    })
  }

  getMyGroups(){
    this.groupService.getMyGroups().subscribe({
      next:(res)=>{
        console.log(res);
        this.groups = res
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  emitTheGroupId(groupId:string){
    this.groupId.emit(groupId)
  }
}
