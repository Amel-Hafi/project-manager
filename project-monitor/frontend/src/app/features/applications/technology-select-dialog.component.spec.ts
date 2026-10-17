import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TechnologySelectDialogComponent } from './technology-select-dialog.component';
import { TechnologyService } from '../../core/services/technology.service';
import { ApplicationService } from '../../core/services/application.service';

describe('TechnologySelectDialogComponent', () => {
    let component: TechnologySelectDialogComponent;
    let fixture: ComponentFixture<TechnologySelectDialogComponent>;

    beforeEach(async () => {
        const technologyServiceSpy = jasmine.createSpyObj('TechnologyService', ['getItemsByCategory']);
        technologyServiceSpy.getItemsByCategory.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 200 }));

        await TestBed.configureTestingModule({
            imports: [TechnologySelectDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: TechnologyService, useValue: technologyServiceSpy },
                { provide: ApplicationService, useValue: jasmine.createSpyObj('ApplicationService', ['updateTechnologies']) },
                { provide: MAT_DIALOG_DATA, useValue: { applicationId: 1, currentTechIds: [], categories: [] } },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TechnologySelectDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty items map', () => {
        expect(component.itemsByCategory().size).toBe(0);
    });
});
