import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSharingComponent } from './data-sharing.component';

describe('DataSharingComponent', () => {
  let component: DataSharingComponent;
  let fixture: ComponentFixture<DataSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataSharingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
