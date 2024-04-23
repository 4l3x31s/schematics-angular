import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLibAlexeisComponent } from './my-lib-alexeis.component';

describe('MyLibAlexeisComponent', () => {
  let component: MyLibAlexeisComponent;
  let fixture: ComponentFixture<MyLibAlexeisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLibAlexeisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyLibAlexeisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
