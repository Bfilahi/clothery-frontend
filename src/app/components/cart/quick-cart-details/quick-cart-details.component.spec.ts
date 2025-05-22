import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCartDetailsComponent } from './quick-cart-details.component';

describe('QuickCartDetailsComponent', () => {
  let component: QuickCartDetailsComponent;
  let fixture: ComponentFixture<QuickCartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickCartDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuickCartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
