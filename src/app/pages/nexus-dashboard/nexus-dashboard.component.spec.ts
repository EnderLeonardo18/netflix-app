import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NexusDashboardComponent } from './nexus-dashboard.component';

describe('NexusDashboardComponent', () => {
  let component: NexusDashboardComponent;
  let fixture: ComponentFixture<NexusDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NexusDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NexusDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
