import { useState, useEffect } from 'react';
import { getPlacementMemos } from '../dashboardService';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { formatNumber } from '../../../services/helperService';
import styles from './firstSection.module.css';
import 'react-circular-progressbar/dist/styles.css';

export default function FirstSection(props) {
  const dbData = props.dashBoardData ? props.dashBoardData : {};
  const [variantAName, setVariantAName] = useState("");
  const [variantBName, setVariantBName] = useState("");

  const [placementMemos, setPlacementMemos] = useState();
  const [placementTotal, setPlacementTotal] = useState(0);

  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const FetchMemos = async () => {
    let tempMemos = await getPlacementMemos(props?.date);
    setPlacementMemos(tempMemos);
  }

  useEffect(() => {
    if (placementMemos?.target?.length > 0) {
      let targetOfA = 0;
      let targetOfB = 0;
      let achievementOfA = 0;
      let achievementOfB = 0;

      setVariantAName(Object.keys(placementMemos?.target[0])[0]);
      setVariantBName(Object.keys(placementMemos?.target[1])[0]);

      placementMemos.target && placementMemos?.target[0]?.["B&H SF"].forEach((item) => {
        targetOfA = targetOfA + item.outlet_count;
      });

      placementMemos.achievements && placementMemos?.achievements[0]?.["B&H SF"].forEach((item) => {
        achievementOfA = achievementOfA + item.outlet_count;
      });

      placementMemos.target && placementMemos?.target[1]?.["B&H BG"].forEach((item) => {
        targetOfB = targetOfB + item.outlet_count;
      });

      placementMemos.achievements && placementMemos?.achievements[1]?.["B&H BG"].forEach((item) => {
        achievementOfB = achievementOfB + item.outlet_count;
      });

      setPlacementTotal(((achievementOfA+achievementOfB)/(targetOfA+targetOfB)*100).toFixed(0))
    } else {
      setPlacementTotal(70);
    }
  }, [placementMemos]);

  useEffect(() => {
    // FetchMemos();
  }, [props.date]);

  const filterData = () => {
    if (props.data.variant?.includes("variantA")) {
      setShowA(true);
    } else {
      setShowA(false);
    }
    // props.data.variant ? props.data.variant.includes("variantA") ? setShowA(true) : setShowA(false) : null;
    props.data.variant?.includes("variantB") ? setShowB(true) : setShowB(false);
    if (!props.data.variant?.length) {
      setShowA(true);
      setShowB(true);
    }
  }

  useEffect(() => {
    filterData();
  }, [props.data]);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.cardView} ${styles.totalOutletWrapper}`}>
        <div className={styles.titleWrapper}>
          <div>Total Outlet Numbers</div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.progressContainer}>
            <div className={styles.progressWrapper}>
              <div>Total</div>

              <div className={styles.totalValue}><h1>{formatNumber(dbData.outlets_in_scope ? dbData.outlets_in_scope : 0)}</h1></div>

              <div>outlets in <span className={styles.progressTitle}>Scope</span></div>
            </div>

            <div className={styles.progressWrapper}>
              <div>Total</div>

              <div className={styles.totalValue}><h1>{formatNumber(dbData.outlets_registered ? dbData.outlets_registered : 0)}</h1></div>

              <div>outlet <span className={styles.progressTitle}>Registered</span></div>
            </div>

            <div className={styles.progressWrapper}>
              <div>Total</div>

              <div className={styles.totalValue}><h1>{formatNumber(dbData.outlets_cr_approved ? dbData.outlets_cr_approved : 0)}</h1></div>

              <div>outlet{"'"}s <span className={styles.progressTitle}>Cr Activated</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.cardView} ${styles.otherCardWrapper}`}>
        <div className={styles.titleWrapper}>
          <div>Collection (%) Till Date</div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.progressContainer}>
            <div className={styles.progressWrapper}>
              <CircularProgressbar
                value={dbData.collection_percentage_till_date ? dbData.collection_percentage_till_date : 0}
                text={`${dbData.collection_percentage_till_date ? dbData.collection_percentage_till_date : 0}%`}
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

            <div className={styles.progressWrapper}>
              <div>
                Total disbursement against collection
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className={`${styles.cardView} ${styles.lastCardWrapper}`}>
        <div className={styles.titleWrapper}>
          <div>No of Due Outlets and Amount</div>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.progressContainer}>
            <div className={styles.progressWrapper}>
              <div>Total</div>

              <div className={styles.totalValue}><h1 style={{color:"#EF7D00"}}>{formatNumber(dbData.no_of_due_outlets_and_amt.total_outlets ? dbData.no_of_due_outlets_and_amt.total_outlets : 0)}</h1></div>

              <div>outlets are <span className={styles.progressTitle}>Due</span></div>
            </div>

            <div className={styles.progressWrapper}>
              <div>Total</div>

              <div className={styles.totalValue}><h1 style={{color:"#EF7D00"}}>{formatNumber(dbData.no_of_due_outlets_and_amt.total_due_amt ? dbData.no_of_due_outlets_and_amt.total_due_amt : 0)}</h1></div>

              <div>amount <span className={styles.progressTitle}>Due</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
