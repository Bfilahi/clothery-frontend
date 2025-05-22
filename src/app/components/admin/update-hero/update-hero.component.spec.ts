import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHeroComponent } from './update-hero.component';

describe('UpdateHeroComponent', () => {
  let component: UpdateHeroComponent;
  let fixture: ComponentFixture<UpdateHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateHeroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
