import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { TrafficLightStatus } from '../../core/models';

@Component({
    selector: 'app-traffic-light',
    standalone: true,
    imports: [MatTooltipModule, TranslateModule],
    template: `
        <span class="traffic-light" [class]="status().toLowerCase()" [matTooltip]="('dashboard.status.' + status()) | translate"></span>
    `,
    styles: [`
        .traffic-light {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            vertical-align: middle;
        }
        .green { background-color: #4caf50; }
        .yellow { background-color: #ff9800; }
        .red { background-color: #f44336; }
    `]
})
export class TrafficLightComponent {
    status = input.required<TrafficLightStatus>();
}
