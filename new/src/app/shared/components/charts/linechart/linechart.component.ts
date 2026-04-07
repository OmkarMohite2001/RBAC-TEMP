import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss'],
})
export class LinechartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  chart: any;

  ngOnInit(): void {
    // No-op
  }

  ngAfterViewInit(): void {
    const chartDom = this.chartContainer.nativeElement;
    this.chart = echarts.init(chartDom);

    // Create some sample data as (x, y) pairs.
    const data = [];
    for (let i = 0; i < 16; i++) {
      // For example, x is i*0.5 and y is a sine function scaled to 1000
      data.push([i * 0.5, Math.sin(i * 0.5) * 1000]);
    }

    const option = {
      tooltip: {
        trigger: 'axis',
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
          lineHeight: 20,
        },
        borderColor: 'transparent',
        borderWidth: 0,
        axisPointer: { type: 'line' },
        formatter: (params: any) => {
          return `Motor Input (KW): ${params[0].data[0]}<br/>Motor Output (KW): ${params[0].data[1]}`;
        },
      },
      xAxis: {
        type: 'value',
        name: 'Motor Input (KW)',
        nameLocation: 'bottom',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontFamily: 'Lato',
          fontSize: 12,
          fontWeight: '600',
          color: '#272B31',
        },
      },
      yAxis: {
        type: 'value',
        name: 'Motor Output (KW)',
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: { show: false },
        axisTick: { show: false },
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
      grid: {
        left: '6%',
        right: '5%',
        bottom: '10%',
        top: '8%',
        containLabel: true,
      },
      series: [
        {
          data: data,
          type: 'line',
          smooth: true,
          symbolSize: 10,
          itemStyle: {
            color: '#009FFD',
            borderWidth: 0,            
            shadowBlur: 2,              
            shadowColor: 'rgba(0, 159, 253, 0.4)',  
            shadowOffsetX: 0,           
            shadowOffsetY: 2 
          },
          lineStyle: {
            width: 3,
          },
          markPoint: {
            // Add the Duty Point marker with a triangle symbol
            data: [
              {
                name: 'Duty Point',
                coord: [4, 0],
                symbol: 'triangle',
                symbolSize: [24, 29],
                label: {
                  show: true,
                  formatter: 'Duty Point [22.73, 24.583]',
                  position: 'bottom',
                  distance: 8,
                  fontSize: 14,
                  color: '#272B31',
                  fontWeight: 600,
                },
                itemStyle: {
                  color: '#009FFD',
                  borderWidth: 0,
                },
              },
            ],
          },
        },
      ],
      media: [
        {
          query: { maxWidth: 540 },
          option: {
            grid: {
              left: '10%',
              right: '2%',
              bottom: '8%',
              top: '5%',
            },
            xAxis: {
              axisLabel: {
                fontSize: 10,
              },
            },
            yAxis: {
              axisLabel: {
                fontSize: 10,
              },
              nameTextStyle: {
                fontSize: 10,
              },
            },
          },
        },
      ],
    };

    this.chart.setOption(option);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
