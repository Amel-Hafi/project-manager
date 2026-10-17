import { Component, computed, input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { MaturityKpiDTO } from '../../core/models';

@Component({
    selector: 'app-kpi-radar',
    standalone: true,
    imports: [TranslateModule, NgChartsModule],
    template: `
    @if (hasData()) {
      <canvas baseChart [data]="chartData()" [options]="chartOptions" type="radar"></canvas>
    } @else {
      <p class="no-data">{{ 'kpis.noData' | translate }}</p>
    }
  `,
    styles: [`
    :host { display: block; max-width: 500px; margin: 0 auto; }
    .no-data { text-align: center; color: rgba(0,0,0,0.54); font-style: italic; }
  `]
})
export class KpiRadarComponent {
    kpi = input<MaturityKpiDTO | null>(null);

    private translateService: TranslateService;

    constructor(translateService: TranslateService) {
        this.translateService = translateService;
    }

    hasData = computed(() => {
        const k = this.kpi();
        if (!k) return false;
        return k.industrialization !== null || k.codeQuality !== null ||
            k.testing !== null || k.deployment !== null ||
            k.obsolescence !== null || k.aiAdoption !== null;
    });

    chartData = computed<ChartData<'radar'>>(() => {
        const k = this.kpi();
        const labels = [
            this.translateService.instant('kpis.industrialization'),
            this.translateService.instant('kpis.codeQuality'),
            this.translateService.instant('kpis.testing'),
            this.translateService.instant('kpis.deployment'),
            this.translateService.instant('kpis.obsolescence'),
            this.translateService.instant('kpis.aiAdoption')
        ];
        return {
            labels,
            datasets: [{
                data: [
                    k?.industrialization ?? 0,
                    k?.codeQuality ?? 0,
                    k?.testing ?? 0,
                    k?.deployment ?? 0,
                    k?.obsolescence ?? 0,
                    k?.aiAdoption ?? 0
                ],
                fill: true,
                backgroundColor: 'rgba(63, 81, 181, 0.2)',
                borderColor: 'rgba(63, 81, 181, 1)',
                pointBackgroundColor: 'rgba(63, 81, 181, 1)'
            }]
        };
    });

    chartOptions: ChartConfiguration<'radar'>['options'] = {
        responsive: true,
        scales: {
            r: {
                min: 0,
                max: 10,
                ticks: { stepSize: 2 }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };
}
