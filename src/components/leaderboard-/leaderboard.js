import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Line } from 'rc-progress';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Loader from "react-loader-spinner";
import { getLeaderboardList } from '../../services/leaderboardService';
import styles from './leaderboard.module.css';

export default function Leaderboard() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [dateRange, setDaterange] = useState([new Date(date), new Date(date)]);

    const [data, setData] = useState();
    const [nationalAverage, setNationalAverage] = useState(0);
    const [isLoading, setIsLoading] = useState();

    const getStrokeColor = (currentPos) => {
        if(currentPos == 1) {
            return '#5DEA53'
        } else if (currentPos >= 2 && currentPos <= 4) {
            return '#E7CA05'
        } else {
            return '#F56161'
        }
    };

    const getData = async () => {
        setIsLoading(true);
        let apiData = await getLeaderboardList();
        let data =  apiData?.data;
        let sortedData = [];
        if (data?.length > 0) {
            data.forEach((item, index) => {
                let percentage = 0;
                if (item.total_scope != 0) {
                    percentage = (parseFloat(item.ac)/parseFloat(item.total_scope)*100).toFixed(2);
                };

                sortedData.push({
                    dpName: item.territory,
                    territory_id: item.territory_id,
                    prevPosition: item.last_day_ranking,
                    signupVsScopePercentage: parseFloat(percentage),
                    am_name: item.am_name,
                    am_image_path: item.am_image_path,
                    to_name: item.to_name,
                    to_image_path: item.to_image_path

                })
            });
        }

        sortedData = sortedData.sort((a, b) => b.signupVsScopePercentage - a.signupVsScopePercentage);
        let signupvsScopeTotal = 0;
        sortedData.forEach((item) => {
            signupvsScopeTotal = signupvsScopeTotal + item.signupVsScopePercentage
        });
        sortedData?.length > 0 ? setNationalAverage((signupvsScopeTotal / sortedData.length).toFixed(2)) : setNationalAverage(0);
        setData(sortedData);
        setIsLoading(false);
    }

    useEffect(() => {
        getData();

        window.intervalLeaderboard = setInterval(() => getData(),120000);
        return () => {clearInterval(window.intervalLeaderboard)}
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.topTitleSection}>
                <img 
                    src="/assets/images/logo/unnoti_logo_leaderboard.svg" 
                    className={styles.unnotiLogo}
                />

                <div className={styles.title}>
                    UNNOTI SIGN-UP LEADERBOARD
                </div>
            </div>

            <div className={styles.tableHeaderWrapper}>
                <div className={styles.tableHeaderLeft}>
                    <div className={`${styles.tableHeaderItem} ${styles.territoryHeader}`}>
                        <FontAwesomeIcon
                            icon="map-marker-alt"
                            size="1x"
                            transform="shrink-5"
                            className={styles.downloadBtn}
                        />

                        <span>Territory</span>
                    </div>

                    <div className={`${styles.tableHeaderItem} ${styles.signupHeader}`}>
                        <span>Signup VS Scope (%)</span>
                    </div>
                </div>

                <div className={styles.dateWrapper}>
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDaterange}
                        format={"dd-MM-y"}
                        maxDate={new Date()}
                        rangeDivider={"~"}
                        className="leaderboard-dateRange"
                    />
                </div>
            </div>

            {isLoading ? 
                <div>
                    <div style={{ textAlign: "center" }}>
                        <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                    </div>
                </div>
                :
                <div className={styles.listWrapper}>
                    <div>
                        {data && 
                            data.map((item, index) => {
                                if (index<10) {
                                    return (
                                        <div key={item.territory_id} className={styles.listItem}>
                                            <div className={styles.listNameWrapper}>
                                                <div>{index + 1}</div>
        
                                                <div className={styles.dpName}>{item.dpName}</div>
        
                                                {((index+1) < item.prevPosition) && 
                                                    <div>
                                                        <div className={styles.smallText}>+{item.prevPosition - (index+1)}</div>
                                                        <FontAwesomeIcon
                                                            icon="angle-up"
                                                            size="1x"
                                                            className={styles.angleUp}
                                                        />
                                                    </div>
                                                }
                                                    
                                                {((index+1) > item.prevPosition) &&
                                                    <div>
                                                        <div className={styles.smallText}>-{(index+1) - item.prevPosition}</div>
                                                        <FontAwesomeIcon
                                                            icon="angle-down"
                                                            size="1x"
                                                            className={styles.angleDown}
                                                        />    
                                                    </div>
                                                }
        
                                                {((index+1) == item.prevPosition) &&
                                                    <div className={styles.minus}>
                                                        <FontAwesomeIcon
                                                            icon="minus"
                                                            size="1x"
                                                            className={styles.minus}
                                                        />
                                                    </div>
                                                }
                                            </div>
        
                                            <div className={styles.listProgressWrapper}>
                                                <div>{item.signupVsScopePercentage}%</div>
        
                                                <div className={styles.lineWrapper}>
                                                    <Line 
                                                        percent={item.signupVsScopePercentage} 
                                                        strokeWidth="6" 
                                                        strokeColor={getStrokeColor((index+1))}
                                                        trailWidth="10" 
                                                        trailColor="#fff"
                                                        className={styles.progressBar}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>

                    

                    <div className={styles.performanceSectionWrapper}>
                        <div>
                            <div className={styles.bestPerformerText}>BEST PERFORMERS</div>

                            {data && 
                                data.map((item, index) => {
                                    if (index == 0) {
                                        return (
                                            <div key={item.territory_id} className={styles.performerInfoWrapper}>
                                                <div>
                                                    <img 
                                                        src={item.am_image_path}
                                                        className={styles.performerImage}
                                                    />

                                                    <div className={styles.performerName}>{item.am_name}</div>

                                                    <div className={styles.performerDesignation}>Area Manager {item.dpName}</div>
                                                </div>

                                                <div>
                                                    <img 
                                                        src={item.to_image_path}
                                                        className={styles.performerImage}
                                                    />

                                                    <div className={styles.performerName}>{item.to_name}</div>

                                                    <div className={styles.performerDesignation}>Territory Officer {item.dpName}</div>
                                                </div>
                                            </div>
                                        )
                                        }
                                })
                            }
                        </div>

                        <div className={styles.nationalAverageWrapper}>
                            <div className={styles.nationalAvgText}>
                                <FontAwesomeIcon
                                    icon="globe"
                                    size="1x"
                                    transform="shrink-5"
                                    className={styles.downloadBtn}
                                />
                                NATIONAL AVERAGE
                            </div>

                            <div className={styles.nationalAvgPercentage}>{nationalAverage}%</div>
                        </div>
                    </div>
                        
                </div>
            }

            <img
                src="/assets/images/logo/unnoti_logo.png"
                className={styles.backgroundBigLogo}
            />

        </div>
    )
}