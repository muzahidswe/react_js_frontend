import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getPlaces, getDashboardData } from './dashboardService';
import { Formik } from 'formik';
import MultiSelect from '../form/admin-select/multiSelect';
import LeftSection from './left-section/leftSection';
import RightSection from './right-section/rightSection';
import LiveIcon from './live-icon/LiveIcon';
import { Timeline, Tween } from 'react-gsap';
import Input from '../form/admin-select/input';
import styles from './dashboard.module.css';
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import Loader from 'react-loader-spinner'
import { useSelector } from 'react-redux';

function DashboardV3() {
  const history = useHistory();
  const {selected_fi} = useSelector(state => state.fi);

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

  let [requestType] = useState("initial");

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
    if(selected_fi) {
      let tempPlaces = await getPlaces(selected_fi);
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
        if(temp_points.length > 0) {
          setDpids(temp_points)

          // updateData('points', temp_points)
        }
      }
    }
  }

  useEffect(() => {
    FetchPlaces();
  }, [selected_fi]);

  useEffect(() => {
    getDBdata();

    window.dashboardInterval = setInterval(() => getDBdata(),180000)
    return () => {clearInterval(window.dashboardInterval)}
    // let timer;
    // clearInterval(timer);
    // timer = setInterval(()=>{
    //     timer = getDBdata()
    // },180000);
  }, [dpIds])

  useEffect(() => {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
  }, [])

  const handleSubmit = async () => {
      requestType = "filtered";
      getDBdata();
  }

  const [dashBoardData, setDashBoardData] = useState({});

  const getDBdata = async () => {
      // setDbIsLoading(true);
      if(dpIds.length > 0) {
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

        let dbData = await getDashboardData(tempDpIds, tempDateRange, requestType);
        if (dbData.success) {
            setDashBoardData(dbData)
        }else{
            setDashBoardData({})
        }
      }
      setDbIsLoading(false);

  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.logoMenuWrapper}>
          <button
            className={`btn p-0 burger-icon burger-icon-left ${styles.mobileMenuIcon}`}
            id="kt_aside_mobile_toggle"
          >
            <span />
          </button>
          <img src="/assets/images/logo/unnoti_logo_new.svg" className={styles.logo} />
        </div>
        

        <div className={styles.filterSectionDesktop} style={{zIndex:9999}}>
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
              <form onSubmit={handleSubmit} className={`${styles.selectionWrapper} dashboard-selection`}>
                <MultiSelect
                  name="regions"
                  data={regions}
                  initialSelected={regions}
                  updateData={updateData}
                  isLoading={isLoading}
                  icon="globe"
                />

                <MultiSelect
                  name="areas"
                  data={areas}
                  initialSelected={areas}
                  updateData={updateData}
                  isLoading={isLoading}
                  icon="globe"
                />

                <MultiSelect
                  name="house"
                  data={companies}
                  initialSelected={companies}
                  updateData={updateData}
                  isLoading={isLoading}
                  icon="warehouse"
                />

                <MultiSelect
                  name="territory"
                  data={territories}
                  initialSelected={territories}
                  updateData={updateData}
                  isLoading={isLoading}
                  icon="map-marker-alt"
                />

                <MultiSelect
                  name="points"
                  data={points}
                  initialSelected={points}
                  updateData={updateData}
                  isLoading={isLoading}
                  icon="map-marker-alt"
                />

                <DateRangePicker
                  value={dateRange}
                  onChange={setDaterange}
                  format={"dd-MM-y"}
                  maxDate={new Date()}
                  rangeDivider={"~"}
                />

                <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={styles.submitButton}>
                  Filter
                </button>
              </form>
              </>
            )}
          </Formik>
        </div>

        <LiveIcon liveDate={liveDate} />
      </div>
      
      <div className={styles.contentWrapper}>        
        <Timeline
          target={
            <Fragment>
              <div className={styles.filterSectionMobile} style={{zIndex:2}}>
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
                    <form onSubmit={handleSubmit} className={`${styles.selectionWrapper} dashboard-selection`}>
                      <MultiSelect
                        name="regions"
                        data={regions}
                        initialSelected={regions}
                        updateData={updateData}
                        isLoading={isLoading}
                        icon="globe"
                      />

                      <MultiSelect
                        name="areas"
                        data={areas}
                        initialSelected={areas}
                        updateData={updateData}
                        isLoading={isLoading}
                        icon="globe"
                      />

                      <MultiSelect
                        name="house"
                        data={companies}
                        initialSelected={companies}
                        updateData={updateData}
                        isLoading={isLoading}
                        icon="warehouse"
                      />

                      <MultiSelect
                        name="territory"
                        data={territories}
                        initialSelected={territories}
                        updateData={updateData}
                        isLoading={isLoading}
                        icon="map-marker-alt"
                      />

                      <MultiSelect
                        name="points"
                        data={points}
                        initialSelected={points}
                        updateData={updateData}
                        isLoading={isLoading}
                        icon="map-marker-alt"
                      />

                      <DateRangePicker
                        value={dateRange}
                        onChange={setDaterange}
                        format={"dd-MM-y"}
                        maxDate={new Date()}
                        rangeDivider={"~"}
                      />

                      <button type="button" onClick={handleSubmit} disabled={isSubmitting} className={styles.submitButton}>
                        Filter
                      </button>
                    </form>
                    </>
                  )}
                </Formik>
              </div>
              <div className={styles.leftSection}>
                {(dashBoardData.success && !dbIsLoading) ? 
                  <LeftSection data={data} date={date} dashBoardData={dashBoardData.data}/>
                  : 
                  <div>
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
              
              <div className={styles.rightSection}>
                {(dashBoardData.success && !dbIsLoading) ? 
                  <RightSection date={date} dashBoardData={dashBoardData.data}/>
                  : 
                  <div>
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
          <Tween from={{ opacity: 0, x: -500 }} to={{ opacity: 1, x: 0 }} duration={1} target={0} />

          <Tween from={{ opacity: 0, x: 500 }} to={{ opacity: 1, x: 0 }} duration={1} target={1}  />
        </Timeline>
      </div>
    </div>
  );
}

export default DashboardV3;
