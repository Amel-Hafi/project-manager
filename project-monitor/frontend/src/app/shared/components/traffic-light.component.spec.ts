import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrafficLightComponent } from './traffic-light.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component } from '@angular/core';

@Component({
    standalone: true,
    imports: [TrafficLightComponent],
    template: `<app-traffic-light [status]="status" />`
})
class TestHostComponent {
    status: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
}

describe('TrafficLightComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, TrafficLightComponent, TranslateModule.forRoot(), MatTooltipModule]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        const el = fixture.nativeElement.querySelector('.traffic-light');
        expect(el).toBeTruthy();
    });

    it('should apply green class for GREEN status', () => {
        hostComponent.status = 'GREEN';
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('.traffic-light');
        expect(el.classList).toContain('green');
    });

    it('should apply yellow class for YELLOW status', () => {
        hostComponent.status = 'YELLOW';
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('.traffic-light');
        expect(el.classList).toContain('yellow');
    });

    it('should apply red class for RED status', () => {
        hostComponent.status = 'RED';
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector('.traffic-light');
        expect(el.classList).toContain('red');
    });
});
