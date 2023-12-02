import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProgressBar from 'react-customizable-progressbar';
import { formatNumber } from '../../services/helperService';
import { baseURL } from "../../constants/constants";
import axios from 'axios';
import LiveIcon from './live-icon/LiveIcon';
import styles from './nationalLaunch.module.css';

export default function NationalLaunch() {
    const [data, setData] = useState();

    const getData = async () => {
        let response = await axios.get(`${baseURL}live-update`)

        setData(response.data.data)
    }

    useEffect(() => {
        getData();

        window.intervalLaunch = setInterval(() => getData(), 15000);
        return () => { clearInterval(window.intervalLaunch) }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topTitleSection}>
                <img
                    src="/assets/images/logo/unnoti_logo_leaderboard.svg"
                    className={styles.unnotiLogo}
                />

                <div className={styles.title}>
                    National Launch Update
                </div>

                <LiveIcon liveDate={true} />
            </div>

            <div className={styles.wrapper}>
                <div className={styles.mapWrapper}>
                    <div className={styles.cardTitle}><div className={styles.regColor}>National Scope</div></div>

                    <img src="/assets/images/maps/map_base.png" className={styles.defaultMap} />

                    <img src={`/assets/images/maps/${data?.map}`} className={styles.changedMap} />
                </div>

                <div className={styles.card}>
                    <div className={styles.cardTitle}><div className={styles.regColor}>Registrations Completed Till Now</div></div>
                    <div className={styles.value}>{formatNumber(data?.till_date_registration)}</div>
                </div>

                <div className={`${styles.card} ${styles.secondCard}`}>
                    <div>
                        <div className={styles.cardTitle}>Registration Percentage</div>
                    </div>

                    <div className={styles.progressWrapper}>
                        <ProgressBar
                            progress={data?.till_date_registration_percentage}
                            radius={100}
                            strokeWidth={13}
                            trackStrokeWidth={13}
                            pointerRadius={7}
                            strokeColor="#55DEF0"
                            pointerStrokeColor="#0092D2"
                        >
                            <div className={styles.progressValue}>
                                {`${data?.till_date_registration_percentage}%`}
                            </div>
                        </ProgressBar>
                    </div>
                </div>
            </div>
        </div>
    )
}