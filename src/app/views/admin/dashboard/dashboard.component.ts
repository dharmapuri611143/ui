import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { egretAnimations } from '../../../shared/animations/egret-animations';
import { UserService } from '../../../shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ApiService } from '../../../shared/services/api.service';
import { EChartOption, ECharts, init } from 'echarts';
import { Subscription } from 'rxjs/Subscription';
import { NgxEchartsDirective } from 'ngx-echarts/lib/ngx-echarts.directive';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: egretAnimations,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  reports: any;
  counts: any;
  years: any = [];
  currentYear = new Date().getFullYear();
  monthNames = [{ 'Jan': 1 }, { 'Feb': 2 }, { 'Mar': 3 }, { 'Apr': 4 }, { 'May': 5 }, { 'Jun': 6 }, { 'Jul': 7 }, { 'Aug': 8 }, { 'Sep': 9 }, { 'Oct': 10 }, { 'Nov': 11 }, { 'Dec': 12 }];
  inquiryOptions: any;
  inquerySeries: any;
  inqueryData: [0];
  sessionOptions: any;
  sessions: any;
  studentData: [0];

  orderOptions: any;
  orderSeries: any;
  orderData: [0];
  ordersM: any;
  salesOptions: any;
  salesSeries: any;
  totalSalesAmount = 0;
  salesData: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  private echart: ECharts;
  private stdechart: ECharts;
  private quizechart: ECharts;
  private orderechart: ECharts;
  private salesechart: ECharts;
  trafficGrowthChart: any;
  bounceRateGrowthChart: any;
  dailySaleChartBar: any;
  quizStatusChat: any;
  countryTrafficStats: any[];
  public subs1: Subscription;
  constructor(private api: ApiService,
    private loader: AppLoaderService,
    private appear: AppConfirmService,
    public sanitizer: DomSanitizer,
    public userService: UserService,
    private cdr: ChangeDetectorRef) { }
  onChartInit(ec) {
    this.echart = ec;
  }
  onStdChartInit(ec) {
    this.stdechart = ec;
  }
  onQuizChartInit(ec) {
    this.quizechart = ec;
  }
  onOrderChartInit(ec) {
    this.orderechart = ec;
  }
  onSalesChartInit(ec) {
    this.salesechart = ec;
  }

  onChartEvent(e, flag) {
    this.updateInquiryChart('day', e.name);
  }
  onChartStedEvent(e, flag) {
    this.updateSessionChart('day', e.name);
  }
  onOrderChartEvent(e, flag) {
    this.updateOrderChart('day', e.name);
  }
  onSalesChartEvent(e, flag) {
    this.updateSaleChart('day', e.name);
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }

  }
  ngOnInit() {
    const user = this.userService.user();
    this.loader.open();
    this.subs1 = this.api.adminDash({}).subscribe(res => {
      this.loader.close();
      this.reports = res;
      setTimeout(() => {
        this.updateInquiryChart('month', '');
        this.updateSessionChart('month', '');
        this.updateOrderChart('month', '');
        this.updateQuizChart();
        this.updateSaleChart('month', '');
      }, 300);
      this.cdr.detectChanges();
    }, err => {
      this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
    this.api.countsDash({}).subscribe(res => {
      this.counts = res;
      this.cdr.detectChanges();
      // this.loader.close();
    }, err => {
      // this.loader.close();
      this.confirmMsg('Fail', err.error);
    });
    this.initInquiryChart('inq');
    this.initInquiryChart('order');
    this.initSaleChart();
    this.initSessionsChart();
    this.quizStatusChat = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      color: [
        'rgba(15, 21, 77, .6)',
        // 'rgba(244, 67, 54, .7)',
        'rgba(15, 21, 77, 0.7)',
        'rgba(15, 21, 77, 0.8)'
      ],
      tooltip: {
        show: false,
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      xAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      series: [
        {
          name: 'Quiz Result Status',
          type: 'pie',
          radius: ['55%', '85%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          hoverOffset: 5,
          stillShowZeroSum: false,
          label: {
            normal: {
              show: false,
              position: 'center',
              textStyle: {
                fontSize: '13',
                fontWeight: 'normal'
              },
              formatter: '{a}'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '15',
                fontWeight: 'normal',
                color: 'rgba(15, 21, 77, 1)'
              },
              formatter: '{b} \n{c} ({d}%)'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 335,
              name: 'Direct'
            },
            {
              value: 310,
              name: 'Search Eng.'
            }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    this.countryTrafficStats = [
      {
        country: 'US',
        visitor: 14040,
        pageView: 10000,
        download: 1000,
        bounceRate: 30,
        flag: 'flag-icon-us'
      },
      {
        country: 'India',
        visitor: 12500,
        pageView: 10000,
        download: 1000,
        bounceRate: 45,
        flag: 'flag-icon-in'
      },
      {
        country: 'UK',
        visitor: 11000,
        pageView: 10000,
        download: 1000,
        bounceRate: 50,
        flag: 'flag-icon-gb'
      },
      {
        country: 'Brazil',
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 30,
        flag: 'flag-icon-br'
      },
      {
        country: 'Spain',
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 45,
        flag: 'flag-icon-es'
      },
      {
        country: 'Mexico',
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 70,
        flag: 'flag-icon-mx'
      },
      {
        country: 'Russia',
        visitor: 4000,
        pageView: 10000,
        download: 1000,
        bounceRate: 40,
        flag: 'flag-icon-ru'
      }
    ];

    this.trafficGrowthChart = {
      tooltip: {
        trigger: 'axis',

        axisPointer: {
          animation: true
        }
      },
      grid: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0', '1', '2', '3', '4'],
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            show: false
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Visit',
          type: 'line',
          smooth: false,
          data: [0, 40, 140, 90, 160],
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            opacity: 0,
            width: 0
          },
          itemStyle: {
            borderColor: 'rgba(233, 31, 99, 0.4)'
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(15, 21, 77, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(15, 21, 77, 0.6)'
                  }
                ]
              }
            }
          }
        }
      ]
    };
    this.bounceRateGrowthChart = {
      tooltip: {
        trigger: 'axis',

        axisPointer: {
          animation: true
        }
      },
      grid: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0', '1', '2', '3', '4'],
        axisLabel: {
          show: false
        },
        axisLine: {
          lineStyle: {
            show: false
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 200,
        interval: 50,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Bounce Rate',
          type: 'line',
          smooth: false,
          data: [0, 20, 90, 120, 190],
          symbolSize: 8,
          showSymbol: false,
          lineStyle: {
            opacity: 0,
            width: 0
          },
          itemStyle: {
            borderColor: 'rgba(233, 31, 99, 0.4)'
          },
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(244, 67, 54, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(244, 67, 54, .4)'
                  }
                ]
              }
            }
          }
        }
      ]
    };
  }
  ngAfterViewInit() {

  }
  initInquiryChart(flag) {
    const label = [];
    for (const item of this.monthNames) {
      const key = Object.keys(item)[0];
      label.push(key);
    }
    const options = {
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444',
        axisPointer: {
          type: 'line',
          animation: true
        }
      },
      grid: {
        top: '10%',
        left: '80px',
        right: '30px',
        bottom: '60'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: label,
        axisLabel: {
          show: true,
          margin: 20,
          color: '#888'
        },
        axisTick: {
          show: false
        },

        axisLine: {
          show: false,
          lineStyle: {
            show: false
          }
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: '#888'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: flag === 'inq' ? 'Inquiry' : 'Order',
          label: { show: false, color: '#0168c1' },
          type: 'bar',
          barGap: 0,
          color: 'rgba(16, 23, 76, .8)',
          smooth: true
        },
      ]
    };
    if (flag === 'inq') {
      this.inquiryOptions = options;
      this.inquerySeries = {
        series: [
          {
            data: this.inqueryData
          }
        ]
      };
    } else if (flag === 'order') {
      this.orderOptions = options;
      this.orderSeries = {
        series: [
          {
            data: this.inqueryData
          }
        ]
      };
    }
  }
  initSaleChart() {
    const label = [];
    for (const item of this.monthNames) {
      const key = Object.keys(item)[0];
      label.push(key);
    }
    this.salesOptions = {
      legend: {
        show: false
      },
      grid: {
        left: '20px',
        right: '20px',
        bottom: '0',
        top: '20',
        containLabel: true
      },
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },
      xAxis: [
        {
          type: 'category',
          data: label,
          axisTick: {
            show: true
          },
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisLabel: {
            show: true,
            margin: 10,
            color: '#888'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: true,
            formatter: '{value}'
          },
          interval: 25000,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false,
            interval: 'auto'
          }
        }
      ],

      series: [
        {
          name: 'Total',
          // data: [1, 1, 1, 1, 1, 1, 1,1, 1, 1, 1, 1, 1],
          label: { show: true, color: '#10174c', position: 'top' },
          type: 'bar',
          barWidth: '12',
          color: '#10174c',
          smooth: true,
          itemStyle: {
            barBorderRadius: 10
          }
        }
      ]
    };
    this.salesSeries = {
      series: [
        {
          data: this.salesData
        }
      ]
    };
  }

  updateInquiryChart(flag, clickMonth) {
    let chartData: any = [];
    for (const item of this.reports.inquiryReport) {
      if (this.years.indexOf(((item || {})._id || {}).year) === -1) {
        this.years.push(((item || {})._id || {}).year);
      }
      if (((item || {})._id || {}).year == this.currentYear) {
        if (flag === 'month') {
          chartData = this.monthly(item.monthlyusage);
        } else {
          chartData = this.daily(item.monthlyusage, clickMonth);
        }
      }
    }
    let chartOption = {};
    chartOption['series'] = [
      {
        data: chartData.data
      }
    ];
    chartOption['xAxis'] = {
      type: 'category',
      boundaryGap: false,
      data: chartData.label,
      axisLabel: {
        show: true,
        margin: 10,
        color: '#888'
      },
      axisTick: {
        show: true
      },

      axisLine: {
        show: true,
        lineStyle: {
          show: true
        }
      },
      splitLine: {
        show: true
      }
    }

    this.echart.setOption(chartOption);
    this.echart.resize();
  }
  updateSessionChart(flag, clickMonth) {
    let chartData: any = [];
    for (const item of this.reports.stdCreated) {
      if (this.years.indexOf(((item || {})._id || {}).year) === -1) {
        this.years.push(((item || {})._id || {}).year);
      }
      if (((item || {})._id || {}).year == this.currentYear) {
        if (flag === 'month') {
          chartData = this.monthly(item.monthlyusage);
        } else {
          chartData = this.daily(item.monthlyusage, clickMonth);
        }
      }
    }
    let chartOption = {};
    chartOption['series'] = [
      {
        data: chartData.data
      }
    ];
    chartOption['xAxis'] = {
      type: 'category',
      data: chartData.label,
      axisLabel: {
        show: true,
        margin: 30,
        color: '#888'
      },
      axisTick: {
        show: false
      },

      axisLine: {
        show: false,
        lineStyle: {
          show: false
        }
      },
      splitLine: {
        show: false
      }
    }

    this.stdechart.setOption(chartOption);
    this.stdechart.resize();
  }

  updateQuizChart() {
    let chartOption = {};
    let cdata = [];
    for (let item of this.reports.asmntStatus) {
      cdata.push({
        value: item.count,
        name: item._id
      });
    }
    chartOption['series'] = [
      {
        data: cdata
      }
    ];

    this.quizechart.setOption(chartOption);
    this.quizechart.resize();
  }
  updateSaleChart(flag, clickMonth) {
    let chartData: any = [];
    for (const item of this.reports.paymentAmount) {
      if (this.years.indexOf(((item || {})._id || {}).year) === -1) {
        this.years.push(((item || {})._id || {}).year);
      }
      if (((item || {})._id || {}).year == this.currentYear) {
        if (flag === 'month') {
          chartData = this.monthly(item.monthlyusage);
        } else {
          chartData = this.daily(item.monthlyusage, clickMonth);
        }
      }
    }
    let chartOption = {};
    chartOption['series'] = [
      {
        data: chartData.data
      }
    ];

    chartOption['xAxis'] = {
      type: 'category',
      boundaryGap: false,
      data: chartData.label,
      axisLabel: {
        show: true,
        margin: 30,
        color: '#888'
      },
      axisTick: {
        show: false
      },

      axisLine: {
        show: false,
        lineStyle: {
          show: false
        }
      },
      splitLine: {
        show: false
      }
    }
    this.salesechart.setOption(chartOption);
    this.salesechart.resize();
  }
  updateOrderChart(flag, clickMonth) {
    let chartData: any = [];
    for (const item of this.reports.orderCreated) {
      if (this.years.indexOf(((item || {})._id || {}).year) === -1) {
        this.years.push(((item || {})._id || {}).year);
      }
      if (((item || {})._id || {}).year == this.currentYear) {
        if (flag === 'month') {
          chartData = this.monthly(item.monthlyusage);
        } else {
          chartData = this.daily(item.monthlyusage, clickMonth);
        }
      }
    }
    let chartOption = {};
    chartOption['series'] = [
      {
        data: chartData.data
      }
    ];
    chartOption['xAxis'] = {
      type: 'category',
      boundaryGap: false,
      data: chartData.label,
      axisLabel: {
        show: true,
        margin: 20,
        color: '#888'
      },
      axisTick: {
        show: false
      },

      axisLine: {
        show: false,
        lineStyle: {
          show: false
        }
      },
      splitLine: {
        show: false
      }
    }

    this.orderechart.setOption(chartOption);
    this.orderechart.resize();
  }
  monthly(data) {
    this.totalSalesAmount = 0;
    const label = [];
    for (const item of this.monthNames) {
      const key = Object.keys(item)[0];
      label.push(key);
    }
    const yAxis: any = [];
    for (const month of this.monthNames) {
      const monthKey = Object.keys(month)[0];
      let monthVal = 0;
      for (const m of data) {
        if (m.month === month[monthKey]) {
          let total = 0;
          for (const item of m.dailyusage) {
            total += item.count;
          }
          monthVal = total;
        }
      }
      this.totalSalesAmount += monthVal;
      yAxis.push(monthVal);
    }
    return { label: label, data: yAxis };
  }
  daily(data, clickMonth) {
    let monthIndex = 0;
    for (const month of this.monthNames) {
      const monthKey = Object.keys(month)[0];
      if (clickMonth === monthKey) {
        monthIndex = month[monthKey];
      }
    }
    const label = [];
    const chartData = [];
    for (const monthData of data) {
      if (monthData.month === monthIndex) {
        const daysInMonth = new Date(this.currentYear, monthIndex, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          let labelData = '';
          let cData = 0;
          for (const dayVal of monthData.dailyusage) {
            if (dayVal.day === i) {
              labelData = dayVal.day;
              cData = dayVal.count;
            }
          }
          if (labelData) {
            label.push('day-' + labelData);
          } else {
            label.push('day-' + i);
          }
          chartData.push(cData);
        };
      }
    }
    return { label: label, data: chartData };
  }
  yearSelect() {
    this.updateInquiryChart('month', '');
    this.updateSessionChart('month', '');
    this.updateOrderChart('month', '');
    this.updateOrderChart('month', '');
  }

  yearSaleSelect() {
    this.updateSaleChart('month', '');
  }
  initSessionsChart() {
    const label = [];
    for (const item of this.monthNames) {
      const key = Object.keys(item)[0];
      label.push(key);
    }
    this.sessionOptions = {
      tooltip: {
        show: true,
        trigger: 'axis',
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3); color: #444',
        axisPointer: {
          type: 'line',
          animation: true
        }
      },
      grid: {
        top: '10%',
        left: '60',
        right: '15',
        bottom: '60'
      },
      xAxis: {
        type: 'category',
        data: label,
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 30,
          color: '#888'
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          margin: 20,
          color: '#888'
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          data: [],
          type: 'line',
          name: 'User',
          smooth: true,
          color: '#10174c',
          lineStyle: {
            opacity: 1,
            width: 3
          },
          itemStyle: {
            opacity: 0
          },
          emphasis: {
            itemStyle: {
              color: 'rgba(16, 23, 76, 1)',
              borderColor: 'rgba(16, 23, 76, .4)',
              opacity: 1,
              borderWidth: 8
            },
            label: {
              show: false,
              backgroundColor: '#fff'
            }
          }
        }
      ]
    };

    this.sessions = {
      series: [
        {
          data: this.studentData
        }
      ]
    };
  }
  confirmMsg(title, msg) {
    this.appear.confirm({ title: title, message: msg, button: 'close' }).subscribe(res => { });
  }

}
