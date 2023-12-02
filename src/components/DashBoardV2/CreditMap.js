import React, { useState, useEffect } from 'react';
import styles from './map.module.css';
import MapComponent from './MapComponent'

const CreditMap = (props) =>{
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftSection}>
        <div className={styles.titleWrapper}>
          <div>Credit Map</div>
        </div>

        <div className={styles.cardContent}>
            <MapComponent 
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `600px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
      </div>
    </div>
  )
}

export default CreditMap;