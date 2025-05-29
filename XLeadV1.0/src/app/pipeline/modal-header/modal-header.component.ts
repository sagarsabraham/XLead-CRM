import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.css']
})
export class ModalHeaderComponent {
  @Input() title: string = '';
  @Input() showOwner: boolean = false;
  @Input() ownerName: string = 'Business Opportunist';

}
