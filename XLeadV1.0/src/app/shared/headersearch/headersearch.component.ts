import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-headersearch',
  templateUrl: './headersearch.component.html',
  styleUrls: ['./headersearch.component.css']
})
export class HeadersearchComponent {
  @Output() search = new EventEmitter<string>();
  searchText: string = '';

  posts = [
    {
      iconName: 'export',
      buttonText: 'Export'
    }
  ];

  onSearchValueChanged(e: any) {
    this.searchText = e.value;
    this.search.emit(this.searchText);
  }

  onExport() {
    console.log('Export clicked');
  }
}