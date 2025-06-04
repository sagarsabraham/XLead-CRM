import { Component } from '@angular/core';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.css']
})
export class NotesTabComponent {
  notes: Note[] = [];
  newNoteContent: string = '';

  addNote() {
    if (!this.newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      content: this.newNoteContent.trim(),
      createdAt: new Date()
    };

    this.notes.unshift(newNote);
    this.newNoteContent = '';
  }

  deleteNote(id: number) {
    this.notes = this.notes.filter(note => note.id !== id);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }
}
