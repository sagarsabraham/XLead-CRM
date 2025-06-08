import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotesService, Note, NoteCreate } from 'src/app/services/notes.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { confirm } from 'devextreme/ui/dialog';

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.css']
})
export class NotesTabComponent implements OnInit, OnDestroy {
  @Input() dealId!: number | null;
  
  newNoteContent: string = '';
  notes: Note[] = [];
  isLoading: boolean = false;
  currentUserId: number;
  
  // Edit functionality properties
  editingNoteId: number | null = null;
  editingNoteText: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private notesService: NotesService,
    private authService: AuthServiceService
  ) {
    this.currentUserId = this.authService.userId;
  }

  ngOnInit(): void {
    if (this.dealId) {
      this.loadNotes();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Add this method to handle real-time input changes
  onNoteContentChange(event: any): void {
    // Handle both event types - DevExtreme events and native events
    if (event && event.value !== undefined) {
      this.newNoteContent = event.value;
    } else if (event && event.target && event.target.value !== undefined) {
      this.newNoteContent = event.target.value;
    }
  }

  // Add this method to handle real-time edit input changes
  onEditContentChange(event: any): void {
    // Handle both event types - DevExtreme events and native events
    if (event && event.value !== undefined) {
      this.editingNoteText = event.value;
    } else if (event && event.target && event.target.value !== undefined) {
      this.editingNoteText = event.target.value;
    }
  }

  loadNotes(): void {
    if (!this.dealId) return;
    
    this.isLoading = true;
    
    this.notesService.getNotesByDealId(this.dealId, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notes) => {
          this.notes = notes || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading notes:', err);
          this.notes = [];
          this.isLoading = false;
        }
      });
  }

  addNote(): void {
    if (!this.newNoteContent.trim() || this.isLoading || !this.dealId) return;

    const newNote: NoteCreate = {
      noteText: this.newNoteContent.trim(),
      dealId: this.dealId,
      createdBy: this.currentUserId
    };

    this.isLoading = true;
    
    this.notesService.createNote(newNote)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (note) => {
          this.notes.unshift(note);
          this.newNoteContent = '';
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating note:', err);
          this.showError('Failed to create note. Please try again.');
          this.isLoading = false;
        }
      });
  }

  startEditing(note: Note): void {
    if (note.createdBy !== this.currentUserId) return;
    
    this.editingNoteId = note.id!;
    this.editingNoteText = note.noteText;
  }

  cancelEditing(): void {
    this.editingNoteId = null;
    this.editingNoteText = '';
  }

  saveEdit(): void {
    if (!this.editingNoteId || !this.editingNoteText.trim() || this.isLoading) return;

    this.isLoading = true;
    
    this.notesService.updateNote(this.editingNoteId, this.editingNoteText.trim(), this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedNote) => {
          // Find and update the note in the array
          const index = this.notes.findIndex(n => n.id === this.editingNoteId);
          if (index !== -1) {
            this.notes[index] = updatedNote;
          }
          
          this.cancelEditing();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error updating note:', err);
          this.showError('Failed to update note. Please try again.');
          this.isLoading = false;
        }
      });
  }

  deleteNote(index: number): void {
    const note = this.notes[index];
    if (!note.id || note.createdBy !== this.currentUserId) return;

    // DevExtreme confirm dialog with custom styling
    const result = confirm(
      '<i class="dx-icon-warning"></i><br/>Are you sure you want to delete this note?<br/><br/>This action cannot be undone.', 
      'Delete Note'
    );
    
    result.then((dialogResult) => {
      if (dialogResult) {
        // User clicked "Yes" - proceed with deletion
        this.performDelete(index, note.id!);
      }
      // If user clicked "No", nothing happens
    });
  }

  private performDelete(index: number, noteId: number): void {
    this.isLoading = true;
    
    this.notesService.deleteNote(noteId, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notes.splice(index, 1);
          this.isLoading = false;
          // Optional: Show success message
          // this.showSuccess('Note deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting note:', err);
          this.showError('Failed to delete note. Please try again.');
          this.isLoading = false;
        }
      });
  }

  private showError(message: string): void {
    // You can use DevExtreme's notify for a better experience
    // For now, using console.error to avoid browser alerts
    console.error(message);
    // If you have DevExtreme notify imported:
    // notify({ message: message, type: 'error', displayTime: 3000 });
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    // Format: Dec 15, 2024 at 2:30 PM
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }) + ' at ' + dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }


}