import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGroupComponent } from './search-group.component';

describe('SearchGroupComponent', () => {
  let component: SearchGroupComponent;
  let fixture: ComponentFixture<SearchGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
