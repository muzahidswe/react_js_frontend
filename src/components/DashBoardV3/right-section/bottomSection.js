import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency } from '../../../services/helperService';
import Chart from "react-apexcharts";
import styles from './bottomSection.module.css';
import ProgressBar from 'react-customizable-progressbar';

export default function RightSection(props) {  
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  const seriesArea = [{
    name: 'Amount of loan taken',
    data: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
      return (last_ten_day_trend.amount / 1000).toFixed(0)
    })
  }, {
    name: 'No. of Retailers Taking Loan',
    data: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
      return last_ten_day_trend.no_of_outlet
    })
  }];

  const optionsArea =  {
    chart: {
      type: 'area',
      height: 250,
      width: '100%',
      foreColor: '#000',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth'
    },
    fill: {
      opacity: 0.6,
      type: 'solid'
    },
    colors: ['#A8D9F0', '#0092D2'],
    labels: dbData.last_ten_day_trend.map((last_ten_day_trend) => {
      return last_ten_day_trend.date
    }),
    xaxis: {
      type: 'datetime'
    },
    yaxis: [{
      
    }, {
      opposite: true
    }],
    legend: {
      fontSize: '12px',
      position: 'top'
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
      y: {
        formatter: function (val, opts) {
          return val
        }
      },
    },
    responsive: [{
      breakpoint: 1500,
      options: {
        chart: {
          width: '100%',
          height: 200,
        },
      }
    }, {
      breakpoint: 1290,
      options: {
        chart: {
          width: '100%',
          height: 160,
        },
      }
    }]
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <div className={styles.cardView}>
          <div className={styles.chartTitle}>Last 10 Days Trend</div>

          <Chart
            options={optionsArea}
            series={seriesArea}
            type="area"
            width={optionsArea.chart.width}
            height={optionsArea.chart.height}
          />
        </div>

        <div className={`${styles.cardView} ${styles.circularCardView}`}>
          <div className={styles.creditUtilization}>
            <div className={styles.chartTitle}>Credit Utilization Rate</div>

            <div className={styles.creditUtilizationWrapper}>
              <div className={styles.progressWrapper}>
                <ProgressBar
                  progress={dbData.strike_rate_today ? dbData.strike_rate_today : 0}
                  radius={100}
                  strokeWidth={13}
                  trackStrokeWidth={13}
                  pointerRadius={7}
                  strokeColor="#55DEF0"
                  pointerStrokeColor="#0092D2"
                >
                  <div className={styles.progressValue}>
                    {`${dbData.strike_rate_today ? parseInt(dbData.strike_rate_today) : 0}%`}
                  </div>
                </ProgressBar>

                <div>
                  <div>Strike Rate</div>
                  <div>Percentage</div>
                </div>
              </div>

              <div className={styles.progressWrapper}>
                <ProgressBar
                  progress={dbData.till_date_credit_utilization_against_daily_limit ? dbData.till_date_credit_utilization_against_daily_limit : 0}
                  radius={100}
                  strokeWidth={13}
                  trackStrokeWidth={13}
                  pointerRadius={7}
                  strokeColor="#1E519F"
                  pointerStrokeColor="#0092D2"
                >
                  <div className={styles.progressValue}>
                    {`${dbData.till_date_credit_utilization_against_daily_limit ? parseInt(dbData.till_date_credit_utilization_against_daily_limit) : 0}%`}
                  </div>
                </ProgressBar>

                <div>
                  <div>Credit Utilization %</div>
                  <div>Against daily limit</div>
                </div>
              </div>

              <div className={styles.progressWrapper}>
                <ProgressBar
                  progress={dbData.till_date_credit_utilization_against_memo_value ? dbData.till_date_credit_utilization_against_memo_value : 0}
                  radius={100}
                  strokeWidth={13}
                  trackStrokeWidth={13}
                  pointerRadius={7}
                  strokeColor="#55DEF0"
                  pointerStrokeColor="#0092D2"
                >
                  <div className={styles.progressValue}>
                    {`${dbData.till_date_credit_utilization_against_memo_value ? parseInt(dbData.till_date_credit_utilization_against_memo_value) : 0}%`}
                  </div>
                </ProgressBar>

                <div>
                  <div>Credit Utilization %</div>
                  <div>Against Memo Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.cardView}>
          <div className={styles.rightCardContent}>
            <div className={styles.sectionTitle}>
              <img src="/assets/images/icons/due_icon.svg" className={styles.titleIcon} />
              <div>Due</div>
              <div>Outlet</div>
              <div>Details</div>
            </div>

            <div className={styles.sectionTitleSmallDevice}>
              <div>Due Outlet Details</div>
            </div>

            <div className={styles.amountWrapper}>
              <div>
                <div className={styles.totalAmount}>{formatCurrency(dbData.no_of_due_outlets_and_amt.total_due_amt ? dbData.no_of_due_outlets_and_amt.total_due_amt : 0)}</div>
                <div>Total <span className={styles.boldText}>Due Amount</span></div>
              </div>

              <div className={styles.line} />

              <div>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.no_of_due_outlets_and_amt.total_outlets ? dbData.no_of_due_outlets_and_amt.total_outlets : 0)}</div>
                <div>No. of <span className={styles.boldText}>Due Outlets</span></div>
              </div>
                
            </div>
          </div>
        </div>

        <div className={styles.cardView}>
          <div className={styles.rightCardContent}>
            <div className={styles.sectionTitle}>
              <img src="/assets/images/icons/total_icon.svg" className={styles.titleIcon} />
              <div>Total</div>
              <div>Outlet</div>
              <div>Numbers</div>
            </div>

            <div className={styles.sectionTitleSmallDevice}>
              <div>Total Outlet Numbers</div>
            </div>

            <div className={styles.outletAmountWrapper}>
              <div className={styles.perItem}>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.outlets_in_scope ? dbData.outlets_in_scope : 0)}</div>
                
                <div>
                  <div>Total outlets</div>
                  <div className={styles.boldText}>In Scope</div>
                </div>
              </div>

              <div className={styles.horizontalLine} />
                
              {/* <div className={styles.perItem}>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.outlets_registered ? dbData.outlets_registered : 0)}</div>
                
                <div>
                  <div>Total outlets</div>
                  <div className={styles.boldText}>Registered</div>
                </div>
              </div> */}

              {/* <div className={styles.horizontalLine} /> */}

              <div className={styles.perItem}>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.outlets_cr_approved ? dbData.outlets_cr_approved : 0)}</div>
                
                <div>
                  <div>Total outlets</div>
                  <div className={styles.boldText}>Credit activated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <img src="/assets/images/icons/unnoti_logo.png" className={styles.unnotiLogo} />
    </div>
  )
}
