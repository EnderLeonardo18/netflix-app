import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictiveCacheComponent } from './predictive-cache.component';

describe('PredictiveCacheComponent', () => {
  let component: PredictiveCacheComponent;
  let fixture: ComponentFixture<PredictiveCacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PredictiveCacheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictiveCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
