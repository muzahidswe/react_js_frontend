import React, { useState, useEffect } from 'react';
import { formatNumber } from '../../../services/helperService';
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import RightSection from './rightSection';
import styles from './secondSection.module.css';

export default function SecondSection(props) {
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <div className={styles.titleWrapper}>
          <div>Credit Utilization</div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.progressWrapper}>
            <div className={styles.progressTitle}>
              <div>Strike rate of</div>
              <div className={styles.boldText}>{dbData.strike_date ? dbData.strike_date : props.date}</div>
            </div>

            <div className={styles.progressBar}>
              <CircularProgressbar
                value={dbData.strike_rate_today ? dbData.strike_rate_today : 0}
                text={`${dbData.strike_rate_today ? dbData.strike_rate_today : 0}%`}
                counterClockwise={true}
                strokeWidth={12}
                styles={buildStyles({
                  textSize: '1.5rem',
                  strokeLinecap: 'butt',
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 1.5,

                  // Colors
                  textColor: '#000',
                  trailColor: '#dedede',
                })}
              />
            </div>
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressTitle}>
              <div>Till Date Credit Utilization</div>
              <div className={styles.boldText}>Against Daily Limit</div>
            </div>

            <div className={styles.progressBar}>
              <CircularProgressbar
                value={dbData.till_date_credit_utilization_against_daily_limit ? dbData.till_date_credit_utilization_against_daily_limit : 0}
                text={`${dbData.till_date_credit_utilization_against_daily_limit ? dbData.till_date_credit_utilization_against_daily_limit : 0}%`}
                counterClockwise={true}
                strokeWidth={12}
                styles={buildStyles({
                  textSize: '1.5rem',
                  strokeLinecap: 'butt',
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 1.5,

                  // Colors
                  textColor: '#000',
                  trailColor: '#dedede',
                })}
              />
            </div>
          </div>

          <div className={styles.progressWrapper}>
            <div className={styles.progressTitle}>
              <div>Till Date Credit Utilization</div>
              <div className={styles.boldText}>Against Memo Value</div>
            </div>

            <div className={styles.progressBar}>
              <CircularProgressbar
                value={dbData.till_date_credit_utilization_against_memo_value ? dbData.till_date_credit_utilization_against_memo_value : 0}
                text={`${dbData.till_date_credit_utilization_against_memo_value ? dbData.till_date_credit_utilization_against_memo_value : 0}%`}
                counterClockwise={true}
                strokeWidth={12}
                styles={buildStyles({
                  textSize: '1.5rem',
                  strokeLinecap: 'butt',
                  // How long animation takes to go from one percentage to another, in seconds
                  pathTransitionDuration: 1.5,

                  // Colors
                  pathColor: `linear-gradient(to bottom, #3c62ae 0%, #049fdb 100%)`,
                  textColor: '#000',
                  trailColor: '#dedede',
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <RightSection date={props.date} dashBoardData={dbData}/>
      </div>
    </div>
  )
}
