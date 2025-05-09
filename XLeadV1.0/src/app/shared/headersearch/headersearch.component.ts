import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-headersearch',
  templateUrl: './headersearch.component.html',
  styleUrls: ['./headersearch.component.css'],
})
export class HeadersearchComponent {
  @Output() search = new EventEmitter<string>();
  searchText: string = '';
  posts = [
    { iconName: 'export', buttonText: 'Export' }
  ];

  onSearch() {
    this.search.emit(this.searchText);
  }

  onExport() {
    console.log('Export clicked');
  }

  onValueChanged(e: any) {
    this.searchText = e.value;
    this.onSearch();
  }
}