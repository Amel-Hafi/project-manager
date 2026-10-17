import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DecisionRuleListComponent } from './decision-rule-list.component';
import { DecisionRuleService } from '../../core/services/decision-rule.service';
import { DecisionRuleDTO } from '../../core/models';

describe('DecisionRuleListComponent', () => {
    let component: DecisionRuleListComponent;
    let fixture: ComponentFixture<DecisionRuleListComponent>;
    let ruleServiceSpy: jasmine.SpyObj<DecisionRuleService>;

    const mockRules: DecisionRuleDTO[] = [
        {
            id: 1,
            name: 'Rule 1',
            description: 'Desc',
            dimension: 'CODE_QUALITY',
            conditionType: 'VALUE_BELOW_THRESHOLD',
            threshold: 5,
            aggregationLevel: 'APPLICATION',
            trafficLightResult: 'RED',
            active: true,
            createdAt: '2025-01-01T00:00:00',
            updatedAt: '2025-01-01T00:00:00'
        }
    ];

    beforeEach(async () => {
        const spy = {
            getAll: jasmine.createSpy('getAll').and.returnValue(of(mockRules)),
            activate: jasmine.createSpy('activate').and.returnValue(of(mockRules[0])),
            deactivate: jasmine.createSpy('deactivate').and.returnValue(of(mockRules[0])),
            delete: jasmine.createSpy('delete').and.returnValue(of(void 0)),
            evaluate: jasmine.createSpy('evaluate').and.returnValue(of({ evaluated: 5, risksCreated: 2, risksResolved: 1 })),
            create: jasmine.createSpy('create').and.returnValue(of(mockRules[0])),
            update: jasmine.createSpy('update').and.returnValue(of(mockRules[0]))
        };

        await TestBed.configureTestingModule({
            imports: [
                DecisionRuleListComponent,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatDialogModule,
                MatSnackBarModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: DecisionRuleService, useValue: spy }
            ]
        }).compileComponents();

        ruleServiceSpy = TestBed.inject(DecisionRuleService) as jasmine.SpyObj<DecisionRuleService>;
        fixture = TestBed.createComponent(DecisionRuleListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load rules on init', () => {
        expect(ruleServiceSpy.getAll).toHaveBeenCalled();
        expect(component.rules()).toEqual(mockRules);
    });

    it('should render table', () => {
        const table = fixture.nativeElement.querySelector('table');
        expect(table).toBeTruthy();
    });

    it('should have evaluate button', () => {
        const buttons = fixture.nativeElement.querySelectorAll('button');
        const evaluateBtn = Array.from(buttons).find((b: any) => b.textContent.includes('play_arrow'));
        expect(evaluateBtn).toBeTruthy();
    });

    it('should call evaluate on evaluateRules', () => {
        component.evaluateRules();
        expect(ruleServiceSpy.evaluate).toHaveBeenCalled();
    });
});
