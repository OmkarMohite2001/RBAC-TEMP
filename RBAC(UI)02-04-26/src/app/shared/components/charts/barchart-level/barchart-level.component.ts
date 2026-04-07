import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-barchart-level',
  templateUrl: './barchart-level.component.html',
  styleUrls: ['./barchart-level.component.scss'],
})
export class BarchartLevelComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  chart: any;
  private resizeObserver!: ResizeObserver;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
    this.observeResize();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.chart) {
      this.chart.resize();
    }
  }

  initChart(): void {
    const chartDom = this.el.nativeElement.querySelector('#chart-container');
    this.chart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#0000003D',
        shadowBlur: 44,
        shadowOffsetX: 0,
        shadowOffsetY: 1,
        textStyle: {
          color: '#272B31',
          fontFamily: 'Lato',
          fontSize: 14,
          fontWeight: '600',
        },
        borderColor: 'transparent',
        borderWidth: 0,
        axisPointer: {
          type: 'none',
        },
      },
      xAxis: {
        type: 'category',
        data: ['2019', '2020', '2021', '2022', '2023'],
        axisTick: { show: false },
        name: 'Years',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: {
          fontSize: 12,
          lineHeight: 14,
          color: '#272B31',
          fontWeight: '600',
        },
        axisLabel: {
          fontFamily: 'Lato',
          fontSize: 12,
          fontWeight: '600',
          color: '#272B31',
        },
        axisLine: {
          lineStyle: {
            color: '#DEE2E6',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: 'Total no of pump tested',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          fontSize: 12,
          lineHeight: 14,
          color: '#272B31',
          fontWeight: '600',
        },
        axisLabel: {
          fontFamily: 'Lato',
          fontSize: 12,
          fontWeight: '600',
          color: '#272B31',
        },
      },
      series: [
        {
          data: [10000, 20000, 30000, 40000, 50000],
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            color: '#009FFD',
            borderRadius: [6, 6, 0, 0],
          },
        },
      ],
      grid: {
        left: '8%',
        right: '0',
        bottom: '10%',
        top: '15%',
      },
      media: [
        {
          query: { maxWidth: 400 },
          option: {
            grid: {
              left: '22%',
            },
            xAxis: {
              axisLabel: {
                fontSize: 10,
              },
            },
            yAxis: {
              nameGap: 44,
              axisLabel: {
                fontSize: 10,
              },
            },
          },
        },
        {
          query: { minWidth: 401, maxWidth: 768 },
          option: {
            grid: {
              left: '15%',
            },
          },
        },
      ],
    };

    this.chart.setOption(option);
  }

  observeResize(): void {
    const chartDom = this.el.nativeElement.querySelector('#chart-container');
    if (chartDom) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      this.resizeObserver.observe(chartDom);
    }
  }
}
