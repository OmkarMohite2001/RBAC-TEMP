import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss'],
})
export class PiechartComponent implements OnInit, OnDestroy, AfterViewInit {
  chart: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChart();
    this.chart.resize();
    window.addEventListener('resize', this.resizeChart); // Add resize listener
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
      window.removeEventListener('resize', this.resizeChart); // Remove listener
    }
  }

  resizeChart = () => {
    if (this.chart) {
      this.chart.resize();
    }
  };

  initChart(): void {
    const chartDom = this.el.nativeElement.querySelector('#main');
    this.chart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: '0',
        left: 'center',
        itemGap: 14,
        textStyle: {
          fontSize: 12,
          fontFamily: 'Lato',
          color: 'black',
          fontWeight: '600',
        },
        itemWidth: 10,
        itemHeight: 10,
        icon: 'circle',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '73%'],
          center: ['50%', '37%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            disabled: true,
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 1048,
              name: 'Splitcase SCPD',
              itemStyle: { color: '#009FFD' },
            },
            {
              value: 735,
              name: 'Multistage MSPD',
              itemStyle: { color: '#E9F5E6' },
            },
            {
              value: 580,
              name: 'Submersible',
              itemStyle: { color: '#C1E2F7' },
            },
            {
              value: 484,
              name: 'Process Pump Division PPD',
              itemStyle: { color: '#C5D434' },
            },
            {
              value: 300,
              name: 'End Section ESPD',
              itemStyle: { color: '#ECA51C' },
            },
          ],
        },
      ],
      media: [
        {
          query: {
            maxWidth: 400,
          },
          option: {
            legend: {
              bottom: '0',
              left: 'center',
              textStyle: {
                fontSize: 10,
              },
            },
            series: [
              {
                radius: ['30%', '60%'],
                center: ['50%', '37%'],
                label: {
                  show: false,
                },
              },
            ],
          },
        },
      ],
    };

    this.chart.setOption(option);
  }
}
