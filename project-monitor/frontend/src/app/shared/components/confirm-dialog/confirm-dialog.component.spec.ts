import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
    let component: ConfirmDialogComponent;
    let fixture: ComponentFixture<ConfirmDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [ConfirmDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { title: 'Confirm', message: 'Are you sure?' } },
                { provide: MatDialogRef, useValue: dialogRefSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title and message from data', () => {
        expect(component.data.title).toBe('Confirm');
        expect(component.data.message).toBe('Are you sure?');
    });

    it('should close with false on cancel', () => {
        component.dialogRef.close(false);
        expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
    });

    it('should close with true on confirm', () => {
        component.dialogRef.close(true);
        expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    });
});
