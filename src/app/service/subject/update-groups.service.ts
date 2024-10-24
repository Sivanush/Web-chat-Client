import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateGroupsService {

  constructor() { }

  private groupsUpdatedSource  = new BehaviorSubject<boolean>(false)
  groupUpdate$ = this.groupsUpdatedSource.asObservable()

  notifyUpdate(){
    this.groupsUpdatedSource.next(true)
  }
}
