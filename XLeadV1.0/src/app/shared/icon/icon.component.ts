// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-icon',
//   templateUrl: './icon.component.html',
//   styleUrls: ['./icon.component.css']
// })
// export class IconComponent {
//   @Input() iconPath: string = '';
// }


import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
})
export class IconComponent {
  @Input() iconPath: string = '';
  @Input() isActive: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}