import { formatNumber } from '../../../services/helperService';
import styles from './leftSection.module.css';
import ProgressBar from 'react-customizable-progressbar'

export default function LeftSection(props) {
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.cardView}`}>
        <div className={styles.topCardContent}>
          <div className={styles.progressWrapper}>
            <ProgressBar
              progress={dbData.collection_percentage_till_date ? dbData.collection_percentage_till_date : 0}
              radius={100}
              strokeWidth={13}
              trackStrokeWidth={13}
              pointerRadius={7}
              strokeColor="#1E519F"
              pointerStrokeColor="#0092D2"
            >
              <div className={styles.progressValue}>
                {`${dbData.collection_percentage_till_date ? parseInt(dbData.collection_percentage_till_date) : 0}%`}
              </div>
            </ProgressBar>
          </div>

          <div className={styles.text}>
            <div>Collection</div>
            <div>Percentage</div>
            <div>Till Date Against Total Disbursement</div>
          </div>
        </div>
      </div>

      <div className={`${styles.cardView}`}>
        <img src='/assets/images/bd_map.png' alt="Bangladesh Map" className={styles.map} />
      </div>
    </div>
  )
}
