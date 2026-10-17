import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationService;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            providers: [
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });
        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show success notification', () => {
        service.success('Test message');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Test message', 'Fermer', {
            duration: 3000,
            panelClass: ['snackbar-success']
        });
    });

    it('should show error notification', () => {
        service.error('Error message');
        expect(snackBarSpy.open).toHaveBeenCalledWith('Error message', 'Fermer', {
            duration: 5000,
            panelClass: ['snackbar-error']
        });
    });
});
