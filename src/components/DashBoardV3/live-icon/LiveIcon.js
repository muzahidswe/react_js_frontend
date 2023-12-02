import styles from './liveIcon.module.css';

export default function LiveWrapper(props) {
  return (
    <>
      {props.liveDate ?
        <div className={styles.liveWrapperAnimate}>
          <div className={styles.circleOuter}></div>
          <div className={styles.circleInner}></div>
        </div>
        :
        <div className={styles.liveWrapper} style={{borderColor: '#5c5c5c'}}>
          <div className={styles.circle} style={{backgroundColor: '#5c5c5c'}} />
        </div>
      }
    </>
  )
}