import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss'],
})
export class BarchartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer:
    | ElementRef
    | undefined;
  chart: any;
  option: any;
  resizeObserver: ResizeObserver | undefined;
  series: any[] = [
    {
      data: [2000, 10000, 15000, 8000, 7000, 11000, 3000],
      type: 'bar',
      stack: 'stacked',
      name: 'Test 1',
    },
    {
      data: [9000, 23000, 21000, 0, 0, 0, 0],
      type: 'bar',
      stack: 'stacked',
      name: 'Test 2',
    },
    {
      data: [15000, 0, 0, 12000, 7000, 0, 0],
      type: 'bar',
      stack: 'stacked',
      name: 'Test 3',
    },
    {
      data: [15000, 0, 0, 12000, 5000, 1000, 1000],
      type: 'bar',
      stack: 'stacked',
      name: 'Test 4',
    },
    {
      data: [6000, 10000, 2000, 0, 10000, 10000, 6000],
      type: 'bar',
      stack: 'stacked',
      name: 'Test 5',
      itemStyle: {
        borderRadius: [0, 0, 0, 0],
      },
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.chartContainer) {
      this.initChart();
      this.setupResizeObserver();
    } else {
      console.error('Chart container is not available!');
    }
  }

  setupResizeObserver(): void {
    if (this.chartContainer) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
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
    const chartDom = this.chartContainer?.nativeElement;
    if (!chartDom) {
      console.error('Chart container DOM is null or undefined');
      return;
    }
    this.chart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'none',
        },
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#0000003D',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 4,
        textStyle: {
          color: '#272B31',
          fontFamily: 'Lato',
          fontSize: 14,
          lineHeight: 20,
          fontWeight: '600',
        },
        borderColor: 'transparent',
        borderWidth: 0,
        formatter: (params: {
          marker: any;
          seriesName: any;
          value: { toLocaleString: () => any };
        }) => {
          return `
            <div class="custom-tooltip">
              <div class="tooltip-arrow"></div>
              <div class="tooltip-content">
                ${params.marker} ${params.seriesName}: ${params.value.toLocaleString()}<br/>
                <span style="margin-left:18px;margin-top: 5px;">Total: ${params.value.toLocaleString()}</span>
              </div>
            </div>
          `;
        },
      },
      xAxis: {
        type: 'category',
        data: ['2019', '2020', '2021', '2022', '2023'],
        axisTick: { show: false },
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
        axisLabel: {
          fontFamily: 'Lato',
          fontSize: 12,
          fontWeight: '600',
          color: '#272B31',
        },
        nameTextStyle: {
          fontFamily: 'Lato',
          fontSize: 12,
          lineHeight: 14,
          color: '#272B31',
          fontWeight: '600',
        },
      },
      series: this.series,
      legend: {
        orient: 'horizontal',
        bottom: '0',
        itemWidth: 7,
        itemHeight: 7,
        itemGap: 20,
        icon: 'circle',
        textStyle: {
          fontFamily: 'Lato',
          fontSize: 12,
          color: '#272B31',
          fontWeight: '600',
        },
      },
      barWidth: 20,
      barCategoryGap: '50%',
      grid: {
        left: '12%',
        right: '0',
        bottom: '12%',
        top: '15%',
      },
      media: [
        {
          query: { maxWidth: 600 },
          option: { grid: { left: '15%' } },
        },
        {
          query: { maxWidth: 400 },
          option: {
            grid: {
              left: '22%',
              bottom: '12%',
            },
            xAxis: {
              axisLabel: {
                fontSize: 10,
              },
            },
            yAxis: {
              nameGap: 45,
              axisLabel: {
                fontSize: 10,
              },
            },
            legend: {
              itemGap: 14,
              textStyle: {
                fontSize: 10,
              },
            },
          },
        },
      ],
    };

    this.chart.setOption(option);

    // Trigger a resize after a short delay to ensure the container has its dimensions
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
  }
}
