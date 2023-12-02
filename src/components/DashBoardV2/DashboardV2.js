import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getPlaces, dashboardData } from './dashboardService';
import { Formik } from 'formik';
import MultiSelect from '../form/admin-select/multiSelect';
import FirstSection from './first-section/firstSection';
import SecondSection from './second-section/secondSection';
import CreditMap from './CreditMap';
import { Timeline, Tween } from 'react-gsap';
import Input from '../form/admin-select/input';
import styles from './dashboard.module.css';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import Loader from 'react-loader-spinner'

function DashboardV2() {
  const history = useHistory();
  const [places, setPlaces] = useState();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateRange, setDaterange] = useState([new Date(date), new Date(date)]);
  //const [dateRange, setDaterange] = useState([]);
  const [liveDate, setLiveDate] = useState(true);
  
  const [regions, setRegions] = useState([]);
  const [areas, setAreas] = useState([]);
  const [territories, setTerritories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [points, setPoints] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [dbIsLoading, setDbIsLoading] = useState(true);

  const [dpIds, setDpids] = useState([]);

  const [data, setData] = useState({});

  const updateData = (name, value) => {
    let array = [];
    value.forEach((item) => array.push(item.value));

    setData((prevState) => {
      return { ...prevState, [name]: [...array] };
    });
    let temp_regions = [];
    let temp_areas = [];
    let temp_territories = [];
    let temp_companies = [];
    let temp_points = [];
    switch(name) {
        case "regions":
            if(places["areas"]) {
                places["areas"].forEach((item) => {
                    value.forEach((tmp) => {
                        if (item.region == tmp.value) {
                            temp_areas.push({'label': item.slug, 'value': item.id});
                        }
                    });                   
                });
                setAreas(temp_areas);
                updateData("areas", temp_areas)
            }
            break;
        case "areas":
            if(places["companies"]) {
                places["companies"].forEach((item) => {
                    value.forEach((tmp) => {
                        if (item.area == tmp.value) {
                            temp_companies.push({'label': item.name, 'value': item.id});
                        }
                    });                   
                });
                setCompanies(temp_companies);
                updateData("companies", temp_companies)
            }
            break;
        case "companies":
            if(places["territory"]) {
                places["territory"].forEach((item) => {
                    value.forEach((tmp) => {
                        if (item.company == tmp.value) {
                            temp_territories.push({'label': item.name, 'value': item.id});
                        }
                    });                   
                });
                setTerritories(temp_territories);
                updateData("territory", temp_territories)
            }
            break;
        case "territory":
            if(places["points"]) {
                places["points"].forEach((item) => {
                    value.forEach((tmp) => {
                        if (item.territory == tmp.value) {
                            temp_points.push({'label': item.name, 'value': item.id});
                        }
                    });                   
                });
                setPoints(temp_points);
                updateData("points", temp_points)
            }
            break;
        case "points":
            setDpids(value)
            break;
        default:
            // code block
    }
  };

  const updateDate = (value) => {
    value === new Date().toISOString().split('T')[0] ? setLiveDate(true) : setLiveDate(false);
    setDate(value);
  }

  const FetchPlaces = async () => {
    let tempPlaces = await getPlaces();
    setPlaces(tempPlaces);
    setIsLoading(false);
    let temp_regions = [];
    let temp_areas = [];
    let temp_territories = [];
    let temp_companies = [];
    let temp_points = [];
    if (tempPlaces !== undefined) {
      if(tempPlaces["regions"]) {
        tempPlaces?.regions.forEach((item) => {
          temp_regions.push({'label': item.slug, 'value': item.id})
        })
      }

      if(tempPlaces["areas"]) {
        tempPlaces?.areas.forEach((item) => {
          temp_areas.push({'label': item.slug, 'value': item.id})
        })
      }

      if(tempPlaces["territory"]) {
        tempPlaces?.territory.forEach((item) => {
          temp_territories.push({'label': item.name, 'value': item.id})
        })
      }

      if(tempPlaces["companies"]) {
        tempPlaces?.companies.forEach((item) => {
          temp_companies.push({'label': item.name, 'value': item.id})
        })
      }

      if(tempPlaces["points"]) {
        tempPlaces?.points.forEach((item) => {
          temp_points.push({'label': item.name, 'value': item.id})
        })
      }
      setRegions(temp_regions)
      setAreas(temp_areas)
      setTerritories(temp_territories)
      setCompanies(temp_companies)
      setPoints(temp_points)
    }
  }

  useEffect(() => {
    FetchPlaces();
    getDBdata();
  }, []);

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }, [])

  const handleSubmit = async () => {
      getDBdata();
  }

  const [dashBoardData, setDashBoardData] = useState({});

  const getDBdata = async () => {
      setDbIsLoading(true);
      let tempDpIds = dpIds.map((dpId) => {
          return dpId.value;
      });
      let tempDateRange = [];
      if (dateRange) {
        tempDateRange = dateRange.map((date, index) =>{
            date.setHours(date.getHours() + !index ? 7 : 0)
            return date.toISOString().split('T')[0]
        })
      }
      let dbData = await dashboardData(tempDpIds, tempDateRange);
      if (dbData.success) {
          setDashBoardData(dbData)
      }else{
          setDashBoardData({})
      }
      setDbIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.flexSection}>
          <div className={styles.logoSection} style={{paddingLeft:"14%", width:"60%"}}>
              <img src="/assets/images/icons/unnoti_logo.png" className={styles.icon} />
            <div className={styles.dashboardText}><h1 className={styles.dashboardH}>UNNOTI DASHBOARD</h1></div>
          </div>

          <div className={styles.userDateWrapper}>
            <div className={styles.dateWrapper}>
              <div className={styles.dateText}>Date / Date Range</div>
              <DateRangePicker
                  value={dateRange}
                  onChange={setDaterange}
                  className={styles.input}
                  format={"dd-MM-y"}
                  maxDate={new Date()}
                  rangeDivider={"~"}
              />

              {/*<Input
                initialValue={date}
                name="date"
                type="date"
                placeholder="date"
                updateData={updateDate}
              />*/}
            </div>
          </div>
        </div>      
          
        <div className={styles.ribonWrapper}>
          <div style={{flex: 4, background: '#0E2B63'}} />
          <div style={{flex: 1, background: '#004F9F'}}/>
          <div style={{flex: 1, background: '#00B1EB'}}/>
        </div>
        
        {liveDate ?
          <div className={styles.liveWrapperAnimate}>
            <div className={styles.circleOuter}></div>
            <div className={styles.circleInner}></div>
          </div>
          :
          <div className={styles.liveWrapper} style={{borderColor: '#5c5c5c'}}>
            <div className={styles.circle} style={{backgroundColor: '#5c5c5c'}} />
          </div>
        }
      </div>
      
      <div className={styles.contentWrapper} style={{paddingTop: "2.5rem"}}>
        <img src="/assets/images/icons/unnoti_logo.png" className={styles.bottomLogo} />        
        <Timeline
          target={
            <Fragment>
              <div>
                <div className={styles.filterSectionWrapper} style={{zIndex:9999}}>
                  <Formik
                    initialValues={data}

                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        setSubmitting(false);
                      }, 400);

                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      isSubmitting,
                    }) => (
                        <>
                      <form onSubmit={handleSubmit} className={styles.selectionWrapper}>
                        <MultiSelect
                          name="regions"
                          data={regions}
                          initialSelected={regions}
                          updateData={updateData}
                          isLoading={isLoading}
                        />

                        <MultiSelect
                          name="areas"
                          data={areas}
                          initialSelected={areas}
                          updateData={updateData}
                          isLoading={isLoading}
                        />

                        <MultiSelect
                          name="companies"
                          data={companies}
                          initialSelected={companies}
                          updateData={updateData}
                          isLoading={isLoading}
                        />

                        <MultiSelect
                          name="territory"
                          data={territories}
                          initialSelected={territories}
                          updateData={updateData}
                          isLoading={isLoading}
                        />

                        <MultiSelect
                          name="points"
                          data={points}
                          initialSelected={points}
                          updateData={updateData}
                          isLoading={isLoading}
                        />

                        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={styles.submitButton}>
                          Filter
                        </button>
                      </form>
                      </>
                    )}
                  </Formik>
                </div>
                {
                    (dashBoardData.success && !dbIsLoading) ? 
                    <FirstSection data={data} date={date} dashBoardData={dashBoardData.data}/>
                    : <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader
                                type="Rings"
                                color="#00BFFF"
                                height={100}
                                width={100}
                            />
                        </div>
                    </div>
                }

                {
                    (dashBoardData.success && !dbIsLoading) ? 
                    <SecondSection date={date} dashBoardData={dashBoardData.data}/>
                    : <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader
                                type="Rings"
                                color="#00BFFF"
                                height={100}
                                width={100}
                            />
                        </div>
                    </div>
                }
                
              </div>

              {/*<div>
                {
                    dashBoardData.success ? 
                    <SecondSection date={date} dashBoardData={dashBoardData.data}/>
                    : <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader
                                type="Rings"
                                color="#00BFFF"
                                height={100}
                                width={100}
                            />
                        </div>
                    </div>
                }
              </div>*/}

              <div>
                    {
                        (dashBoardData.success && !dbIsLoading) ? 
                        <CreditMap />
                        : <div>
                            <div style={{ textAlign: "center" }}>
                                <Loader
                                    type="Rings"
                                    color="#00BFFF"
                                    height={100}
                                    width={100}
                                />
                            </div>
                        </div>
                    }
              </div>
            </Fragment>
          }
        >
          <Tween
            from={{ opacity: 0, y: 600 }}
            to={{ opacity: 1, y: 0 }}
            stagger={0.5}
            ease="elastic.out(1, 0.3)"
            duration={2}
            target={0}
          />

          <Tween from={{ opacity: 0, y: 400 }} to={{ opacity: 1, y: 0 }} duration={1} target={1}  />
        </Timeline>
      </div>
    </div>
  );
}

export default DashboardV2;
