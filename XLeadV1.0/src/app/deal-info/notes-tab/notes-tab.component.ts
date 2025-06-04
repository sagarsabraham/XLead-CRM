import { Component } from '@angular/core';

interface Note {
  content: string;
  createdAt: Date;
}

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.css']
})
export class NotesTabComponent {
  newNoteContent: string = '';
  notes: Note[] = [];

  addNote(): void {
    if (!this.newNoteContent.trim()) return;

    this.notes.unshift({
      content: this.newNoteContent.trim(),
      createdAt: new Date()
    });

    this.newNoteContent = '';
  }

  // ✅ Make sure this function is exactly here
  deleteNote(index: number): void {
    this.notes.splice(index, 1);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}