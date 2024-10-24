import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChatNavbarComponent } from './group-chat-navbar.component';

describe('GroupChatNavbarComponent', () => {
  let component: GroupChatNavbarComponent;
  let fixture: ComponentFixture<GroupChatNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupChatNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupChatNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
