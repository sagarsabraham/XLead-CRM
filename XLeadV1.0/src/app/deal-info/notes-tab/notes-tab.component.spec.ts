import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { NotesTabComponent } from './notes-tab.component';
import { NotesService, Note } from 'src/app/services/notes.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';

describe('NotesTabComponent', () => {
  let component: NotesTabComponent;
  let fixture: ComponentFixture<NotesTabComponent>;
  let mockNotesService: jasmine.SpyObj<NotesService>;

  const MOCK_USER_ID = 1;
  const MOCK_DEAL_ID = 123;
  const MOCK_NOTES: Note[] = [
    { id: 1, noteText: 'User note', createdBy: MOCK_USER_ID, createdByName: 'Current User', createdAt: new Date() },
    { id: 2, noteText: 'Other note', createdBy: 99, createdByName: 'Other User', createdAt: new Date() },
  ];

  beforeEach(async () => {
    mockNotesService = jasmine.createSpyObj('NotesService', ['getNotesByDealId', 'createNote', 'updateNote', 'deleteNote']);

    await TestBed.configureTestingModule({
      declarations: [NotesTabComponent],
      providers: [
        { provide: NotesService, useValue: mockNotesService },
        { provide: AuthServiceService, useValue: { userId: MOCK_USER_ID } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesTabComponent);
    component = fixture.componentInstance;
    component.dealId = MOCK_DEAL_ID;

    mockNotesService.getNotesByDealId.and.returnValue(of([...MOCK_NOTES]));
    
    fixture.detectChanges();
  });

  it('should create and load initial notes on init', () => {
    expect(component).toBeTruthy();
    expect(mockNotesService.getNotesByDealId).toHaveBeenCalledWith(MOCK_DEAL_ID, MOCK_USER_ID);
    expect(component.notes.length).toBe(2);
  });

  describe('addNote', () => {
    it('should call createNote service and add the new note to the list', () => {
      const newNoteText = 'A new test note';
      const newNoteResponse: Note = { id: 3, noteText: newNoteText, createdBy: MOCK_USER_ID, createdByName: 'Current User', createdAt: new Date() };
      mockNotesService.createNote.and.returnValue(of(newNoteResponse));
      component.newNoteContent = newNoteText;

      component.addNote();

      expect(mockNotesService.createNote).toHaveBeenCalled();
      expect(component.notes[0]).toBe(newNoteResponse);
    });
  });

  describe('Editing Notes', () => {
    it('should enter edit mode when startEditing is called by the note owner', () => {
      const userNote = MOCK_NOTES[0];
      component.startEditing(userNote);
      expect(component.editingNoteId).toBe(userNote.id!);
      expect(component.editingNoteText).toBe(userNote.noteText);
    });

    it('should save an edited note and exit edit mode', () => {
      const userNote = MOCK_NOTES[0];
      const updatedText = 'Updated note content';
      const updatedNoteResponse: Note = { ...userNote, noteText: updatedText, updatedAt: new Date() };
      mockNotesService.updateNote.and.returnValue(of(updatedNoteResponse));

      component.startEditing(userNote);
      component.editingNoteText = updatedText;
      component.saveEdit();

      expect(mockNotesService.updateNote).toHaveBeenCalledWith(userNote.id!, updatedText, MOCK_USER_ID);
      expect(component.notes[0].noteText).toBe(updatedText);
    });
  });

  // --- REVISED DELETING NOTES TESTS ---
  describe('Deleting Notes', () => {
    it('should NOT start the delete process for a note owned by another user', () => {
      // Spy on the internal method we expect NOT to be called
      const performDeleteSpy = spyOn<any>(component, 'performDelete');

      // Call the public method on a note the user doesn't own (index 1)
      component.deleteNote(1);

      // Assert that the internal delete logic was never reached
      expect(performDeleteSpy).not.toHaveBeenCalled();
    });

    // We test the private method directly, as testing the dialog interaction is not possible
    // without changing the component's code.
    it('performDelete() should call the service and remove the note from the array', () => {
      const noteToDelete = MOCK_NOTES[0];
      const initialLength = component.notes.length;
      mockNotesService.deleteNote.and.returnValue(of(undefined));
      
      // Call the private method directly with test data
      (component as any).performDelete(0, noteToDelete.id!);

      // Assert that the service was called correctly
      expect(mockNotesService.deleteNote).toHaveBeenCalledWith(noteToDelete.id!, MOCK_USER_ID);
      expect(component.isLoading).toBe(false);

      // Assert that the note was removed from the local array
      expect(component.notes.length).toBe(initialLength - 1);
      expect(component.notes.find(n => n.id === noteToDelete.id!)).toBeUndefined();
    });
  });

  it('should complete the destroy$ subject on ngOnDestroy', () => {
    const destroySubject = (component as any).destroy$;
    spyOn(destroySubject, 'next').and.callThrough();
    spyOn(destroySubject, 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(destroySubject.next).toHaveBeenCalled();
    expect(destroySubject.complete).toHaveBeenCalled();
  });
});