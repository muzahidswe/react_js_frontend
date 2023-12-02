import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../../services/helperService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Chart from "react-apexcharts";
import styles from './rightSection.module.css';
import 'react-circular-progressbar/dist/styles.css';

export default function RightSection(props) {  
  const dbData = props.dashBoardData ? props.dashBoardData : {};
  
  const series= [{
    name: 'Credit Amount',
    type: 'column',
    //data: [4.5, 3.8, 4.0, 4.2, 3.5, 4.2, 3.8, 4.5, 4, 4.8, 4.5, 4.5]
    data: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
        return (last_ten_day_trend.amount / 1000000).toFixed(2)
    })
  }, {
    name: 'No of Outlets',
    type: 'line',
    //data: [2400, 2420, 2500, 2600, 2480, 2580, 2550, 2600, 2520, 2500, 2480, 2420]
    data: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
        return last_ten_day_trend.no_of_outlet
    })
  }];

  const options = {
    chart: {
      type: 'line',
      height: '100%',
      width: '100%',
      foreColor: '#000'
    },

    plotOptions: {
      bar: {
        // distributed: true,
        dataLabels: {
          position: 'start',
        },
      }
    },
    colors: ['#059EDA', '#ED0A80'],
    dataLabels: {
      enabled: false,
      style: {
        colors: ['#000']
      },
      offsetY: -30,
      formatter: function (val, opt) {
        return `${val}`
      },
      dropShadow: {
        enabled: false
      }
    },
    stroke: {
      width: [0, 4]
    },
    labels: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
        return last_ten_day_trend.date
    }),
    xaxis: {
      type: 'datetime'
    },
    yaxis: [{
      title: {
        text: 'Credit Amount (In Millions)',
      },

    }, {
      opposite: true,
      title: {
        text: 'No of Outlets'
      }
    }],
    // legend: {
    //   show: false,
    // },
    tooltip: {
      theme: 'dark',
      x: {
        title: {
          formatter: function (val, opts) {
            return `${val}`
          }
        },
        show: true
      },
      y: {
        title: {
          formatter: function (val, opts) {
            return `${val}`
          }
        }
      }
    },
    responsive: [{
      breakpoint: 1600,
      options: {
        chart: {
          width: '100%',
          height: '100%',
        },
      }
    }]
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <div className={styles.cardView}>
          <div className={styles.titleWrapper}>
            <div>Today{'\''}s Disbursement</div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.perItem}>
              <div className={styles.key}>No of disburse</div>
              <img src="/assets/images/icons/loan.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_disbursement.no_of_disburse ? dbData.todays_disbursement.no_of_disburse : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Total amount (BDT)</div>
              <img src="/assets/images/icons/amount.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_disbursement.total_credit_taken_amount ? dbData.todays_disbursement.total_credit_taken_amount : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Avg. dis. per outlet</div>
              <img src="/assets/images/icons/outlet_loan.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_disbursement.avg_disp_per_outlet ? dbData.todays_disbursement.avg_disp_per_outlet : 0)}</div>
            </div>
          </div>
        </div>


        <div className={styles.cardView}>
          <div className={styles.titleWrapper}>
            <div>Today{"'"}s Collection</div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.perItem}>
              <div className={styles.key}>No of collection</div>
              <img src="/assets/images/icons/collection.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_collection.no_of_collections ? dbData.todays_collection.no_of_collections : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Total amount (BDT)</div>
              <img src="/assets/images/icons/amount.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_collection.total_collection_amount ? dbData.todays_collection.total_collection_amount : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Avg. outlet coll.</div>
              <img src="/assets/images/icons/outlet_collection.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.todays_collection.avg_collection_per_outlet ? dbData.todays_collection.avg_collection_per_outlet : 0)}</div>
            </div>
          </div>
        </div>


        <div className={styles.cardView}>
          <div className={styles.titleWrapper}>
            <div>Till Date  Disbursement</div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.perItem}>
              <div className={styles.key}>No of disburse</div>
              <img src="/assets/images/icons/loan.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_disbursement.no_of_disburse ? dbData.till_date_disbursement.no_of_disburse : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Total amount (BDT)</div>
              <img src="/assets/images/icons/amount.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_disbursement.total_credit_taken ? dbData.till_date_disbursement.total_credit_taken : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Avg. dis. per outlet</div>
              <img src="/assets/images/icons/outlet_loan.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_disbursement.avg_disp_per_outlet ? dbData.till_date_disbursement.avg_disp_per_outlet : 0)}</div>
            </div>
          </div>
        </div>


        <div className={styles.cardView}>
          <div className={styles.titleWrapper}>
            <div>Till Date Collection</div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.perItem}>
              <div className={styles.key}>No of collection</div>
              <img src="/assets/images/icons/collection.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_collection.no_of_collections ? dbData.till_date_collection.no_of_collections : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Total amount (BDT)</div>
              <img src="/assets/images/icons/amount.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_collection.total_collection_amount ? dbData.till_date_collection.total_collection_amount : 0)}</div>
            </div>

            <div className={styles.perItem}>
              <div className={styles.key}>Avg. outlet coll.</div>
              <img src="/assets/images/icons/outlet_collection.png" className={styles.icon} />
              <div className={styles.value}>{formatNumber(dbData.till_date_collection.avg_collection_per_outlet ? dbData.till_date_collection.avg_collection_per_outlet : 0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.titleWrapper}>
          <div>Last 10 Day Trend</div>
        </div>

        <div className={styles.cardContent}>
          <Chart
            options={options}
            series={series}
            type="line"
            width={options.chart.width}
            height={options.chart.height}
          />
          
        </div>
      </div>
    </div>
  )
}
