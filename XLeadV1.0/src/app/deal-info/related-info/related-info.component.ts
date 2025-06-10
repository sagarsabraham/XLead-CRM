import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-related-info',
  templateUrl: './related-info.component.html',
  styleUrls: ['./related-info.component.css']
})
export class RelatedInfoComponent {
  @Input() title: string = '';
  @Input() items: Array<{icon: string, text: string, isLink?: boolean, isPhone?: boolean}> = [];

  getIconName(iconKey: string): string {
    const iconMap: {[key: string]: string} = {
      'user': 'user',
      'email': 'email',
      'tel': 'tel',
      'home': 'home',
      'globe': 'globe',
      'edit': 'edit'
    };
    
    return iconMap[iconKey] || 'help';
  }
}