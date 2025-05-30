import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealcardComponent } from './dealcard.component';
import { DxBoxModule} from 'devextreme-angular';
import { CommonModule } from '@angular/common';

describe('DealcardComponent', () => {
  let component: DealcardComponent;
  let fixture: ComponentFixture<DealcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealcardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
