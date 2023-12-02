import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency } from '../../../services/helperService';
import BottomSection from './bottomSection';
import styles from './rightSection.module.css';

export default function RightSection(props) {
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  return (
    <>
      <div className={styles.topSection}>
        <div className={`${styles.cardView} ${styles.disbursementWrapper}`}>
          <div className={styles.todayDisbursement}>
            <div className={`${styles.title} ${styles.secondaryTextColor}`}>Today's Disbursement</div>

            <div className={styles.amountWrapper}>
              <div>
                <div className={styles.totalAmount}>{formatCurrency(dbData.todays_disbursement.total_credit_taken_amount ? dbData.todays_disbursement.total_credit_taken_amount : 0)}</div>
                <div>Total Disbursed</div>
              </div>

              <div>
                <div className={`${styles.secondaryTextColor} ${styles.secondaryAmount}`}>{formatCurrency(dbData.todays_disbursement.avg_disp_per_outlet ? dbData.todays_disbursement.avg_disp_per_outlet : 0)}</div>
                <div>Average Disbursement Per Outlet</div>
              </div>

              <div>
                <div className={`${styles.secondaryTextColor} ${styles.secondaryAmount}`}>{formatNumber(dbData.todays_disbursement.no_of_disburse ? dbData.todays_disbursement.no_of_disburse : 0)}</div>
                <div>No. of Loans Disbursed</div>
              </div>
            </div>
          </div>

          <div>
            <div className={`${styles.title} ${styles.secondaryTextColor}`}>Till date Disbursement</div>

            <div className={styles.amountWrapper}>
              <div>
                <div className={styles.totalAmount}>{formatCurrency(dbData.till_date_disbursement.total_credit_taken ? dbData.till_date_disbursement.total_credit_taken : 0)}</div>
                <div>Total Disbursed</div>
              </div>

              <div>
                <div className={`${styles.secondaryTextColor} ${styles.secondaryAmount}`}>{formatCurrency(dbData.till_date_disbursement.avg_disp_per_outlet ? dbData.till_date_disbursement.avg_disp_per_outlet : 0)}</div>
                <div>Average Disbursement Per Outlet</div>
              </div>

              <div>
                <div className={`${styles.secondaryTextColor} ${styles.secondaryAmount}`}>{formatNumber(dbData.till_date_disbursement.no_of_disburse ? dbData.till_date_disbursement.no_of_disburse : 0)}</div>
                <div>No. of Loans Disbursed</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.cardView} ${styles.collectionWrapper}`}>
          <div className={styles.todayCollection}>
            <div className={`${styles.title}`}>Today's Collection</div>

            <div className={styles.amountWrapper}>
              <div>
                <div className={`${styles.totalAmount} ${styles.totalColorCollection}`}>{formatCurrency(dbData.todays_collection.total_collection_amount ? dbData.todays_collection.total_collection_amount : 0)}</div>
                <div>Total Collection</div>
              </div>

              <div>
                <div className={styles.secondaryAmount}>{formatCurrency(dbData.todays_collection.avg_collection_per_outlet ? dbData.todays_collection.avg_collection_per_outlet : 0)}</div>
                <div>Average Collection Per Outlet</div>
              </div>

              <div>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.todays_collection.no_of_collections ? dbData.todays_collection.no_of_collections : 0)}</div>
                <div>No. of Loans Collected</div>
              </div>
            </div>
          </div>

          <div>
            <div className={`${styles.title}`}>Till date Collection</div>

            <div className={styles.amountWrapper}>
              <div>
                <div className={`${styles.totalAmount} ${styles.totalColorCollection}`}>{formatCurrency(dbData.till_date_collection.total_collection_amount ? dbData.till_date_collection.total_collection_amount : 0)}</div>
                <div>Total Collection</div>
              </div>

              <div>
                <div className={styles.secondaryAmount}>{formatCurrency(dbData.till_date_collection.avg_collection_per_outlet ? dbData.till_date_collection.avg_collection_per_outlet : 0)}</div>
                <div>Average Collection Per Outlet</div>
              </div>

              <div>
                <div className={styles.secondaryAmount}>{formatNumber(dbData.till_date_collection.no_of_collections ? dbData.till_date_collection.no_of_collections : 0)}</div>
                <div>No. of Loans Collected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <BottomSection date={props.date} dashBoardData={dbData}/>
      </div>
    </>
  )
}
