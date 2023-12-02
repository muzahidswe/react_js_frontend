import React, { useEffect, useState } from "react";
import { getLocationsForReport } from "../../services/helperService";
import { useAlert } from 'react-alert'
import Loader from 'react-loader-spinner'
import Select from 'react-select'
import { Card } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import Button from '@material-ui/core/Button';
import { TextField } from "@material-ui/core";
import styles from './topDropdownBill.module.css';
import { useSelector } from "react-redux";

function DropdownMenuGroup(props) {
    const {selected_fi} = useSelector(state => state.fi);

    const alert=  useAlert();
    const [isLoading, setIsLoading] = useState(true);


    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState([]);
    const [selectedTerritory, setSelectedTerritory] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState([]);

    const [regions, setRegions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [house, setHouse] = useState([]);
    const [territory, setTerritory] = useState([]);
    const [points, setPoints] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [regionRepo, setRegionRepo] = useState([]);
    const [areaByRegionRepo, setAreaByRegionRepo] = useState({});
    const [houseByRegionRepo, setHouseByRegionRepo] = useState({});
    const [houseByAreaRepo, setHouseByAreaRepo] = useState({});
    const [territoryByHouseRepo, setTerritoryByHouseRepo] = useState({});
    const [pointByRegionRepo, setPointByRegionRepo] = useState({});
    const [pointByAreaRepo, setPointByAreaRepo] = useState({});
    const [pointByHouseRepo, setPointByHouseRepo] = useState({});
    const [pointByTerritoryRepo, setPointByTerritoryRepo] = useState({});

    const [routeByPointRepo, setRouteByPointRepo] = useState({});

    const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const [fromDate, setFromDate] = useState(`${new Date().getFullYear()}-${currentMonth}-01`);
    const [toDate, setToDate] = useState(`${new Date().getFullYear()}-${currentMonth}-30`);

    const getRouteSections = () => {
        var routeSections = [];
        if (routes.length > 0) {
            routes.forEach(e => {
                routeSections.push(e.value);
            })
        }
        var dpids = [];
        if (selectedPoint.length > 0) {
            selectedPoint.forEach(e => {
                dpids.push(e.value);
            })
        }
        props.onSearch(dpids, fromDate, toDate);
    }


    const onChangeRegion = (event) => {
        let val = [event.target.value];
        var tempArea = [];
        var tempHouse = [];
        var tempTerritory = [];
        var tempPoint = [];
        val.forEach(e => {
            var tempA = areaByRegionRepo[e];
            var tempH = houseByRegionRepo[e];
            var tempP = pointByRegionRepo[e];
            var tempT = [];
            tempH.forEach(f => {
                var tempTT = territoryByHouseRepo[f.value];
                tempT.push(...tempTT);
            })

            tempArea.push(...tempA);
            tempHouse.push(...tempH);
            tempTerritory.push(...tempT);
            tempPoint.push(...tempP);
        });

        setSelectedRegion(event.target.value);
        setSelectedPoint(tempPoint);

        setAreas(tempArea);
        setHouse(tempHouse);
        setTerritory(tempTerritory);
        setPoints(tempPoint);
    }

    const onChangeArea = (event) => {
        let val = [event.target.value];
        var tempHouse = [];
        var tempTerritory = [];
        var tempPoint = [];
        val.forEach(e => {
            var tempH = houseByAreaRepo[e];
            var tempP = pointByAreaRepo[e];
            var tempT = [];
            tempH.forEach(f => {
                var tempTT = territoryByHouseRepo[f.value];
                tempT.push(...tempTT);
            })
            tempHouse.push(...tempH);
            tempTerritory.push(...tempT);
            tempPoint.push(...tempP);
        });

        setSelectedArea(event.target.value);
        setSelectedPoint(tempPoint);

        setHouse(tempHouse);
        setTerritory(tempTerritory);
        setPoints(tempPoint);
    }

    const onChangeHouse = (event) => {
        let val = [event.target.value];
        let tempTerritory = [];
        let tempPoint = [];
        val.forEach(e => {
            const tempTArray = territoryByHouseRepo[e];
            const tempPArray = pointByHouseRepo[e];
            if (typeof tempTArray !== 'undefined') {
                tempTerritory.push(...tempTArray);
            }
            tempPoint.push(...tempPArray);

        })
        setSelectedHouse(event.target.value);
        setSelectedPoint(tempPoint);

        setTerritory(tempTerritory);
        setPoints(tempPoint);
    }

    useEffect(async () => {
        if (selected_fi) {
            const locations = await getLocationsForReport(selected_fi);
            if (!locations) {
                    alert.error("Some Error Occurred");
            } else {            
                var tempRegionRepo = [];
                var tempAreaByRegionRepo = {};
                var tempHouseByRegionRepo = {};
                var tempHouseByAreaRepo = {};
                var tempTerritoryByHouseRepo = {};
                var tempPointByRegionRepo = {};
                var tempPointByAreaRepo = {};
                var tempPointByHouseRepo = {};
                var tempPointByTerritoryRepo = {};
                var tempRouteByPointRepo = {};

                var tempRegions = [];
                locations.regions.forEach(e => {
                    tempRegionRepo.push({ value: e.id, label: e.slug });
                    var temp = {
                        label: e.slug,
                        value: e.id
                    }
                    tempRegions.push(temp);
                });
                var tempAreas = [];

                locations.areas.forEach(e => {
                    if (e.region in tempAreaByRegionRepo) {
                        tempAreaByRegionRepo[e.region].push({
                            value: e.id,
                            label: e.slug
                        });
                    } else {
                        tempAreaByRegionRepo[e.region] = [{
                            value: e.id,
                            label: e.slug
                        }];
                    }
                    var temp = {
                        label: e.slug,
                        value: e.id,
                    };
                    tempAreas.push(temp);
                });
                var tempHouses = [];
                locations.companies.forEach(e => {
                    if (e.area in tempHouseByAreaRepo) {
                        tempHouseByAreaRepo[e.area].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempHouseByAreaRepo[e.area] = [{
                            value: e.id,
                            label: e.name
                        }];
                    }

                    if (e.region in tempHouseByRegionRepo) {
                        tempHouseByRegionRepo[e.region].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempHouseByRegionRepo[e.region] = [{
                            value: e.id,
                            label: e.name
                        }]
                    }
                    var temp = {
                        label: e.name,
                        value: e.id
                    };
                    tempHouses.push(temp);
                });

                var tempTerritory = [];
                locations.territory.forEach(e => {
                    //rTerritories[e.company][e.id] = e.name;
                    if (e.company in tempTerritoryByHouseRepo) {
                        tempTerritoryByHouseRepo[e.company].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempTerritoryByHouseRepo[e.company] = [{
                            value: e.id,
                            label: e.name
                        }]
                    }
                    var temp = {
                        label: e.name,
                        value: e.id
                    };
                    tempTerritory.push(temp);
                });

                var tempPoints = [];
                locations.points.forEach(e => {
                    if (e.territory in tempPointByTerritoryRepo) {
                        tempPointByTerritoryRepo[e.territory].push({
                            value: e.id,
                            label: e.name
                        });

                    } else {
                        tempPointByTerritoryRepo[e.territory] = [{
                            value: e.id,
                            label: e.name
                        }]
                    }

                    if (e.dsid in tempPointByHouseRepo) {
                        tempPointByHouseRepo[e.dsid].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempPointByHouseRepo[e.dsid] = [{
                            value: e.id,
                            label: e.name
                        }];
                    }

                    if (e.area in tempPointByAreaRepo) {
                        tempPointByAreaRepo[e.area].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempPointByAreaRepo[e.area] = [{
                            value: e.id,
                            label: e.name
                        }];
                    }
                    if (e.region in tempPointByRegionRepo) {
                        tempPointByRegionRepo[e.region].push({
                            value: e.id,
                            label: e.name
                        });
                    } else {
                        tempPointByRegionRepo[e.region] = [{
                            value: e.id,
                            label: e.name
                        }];
                    }


                    var temp = {
                        label: e.name,
                        value: e.id
                    };
                    tempPoints.push(temp);
                });

                var tempRoutes = [];
                locations.routes_sections.forEach(e => {
                    if (e.id in tempRouteByPointRepo) {
                        tempRouteByPointRepo[e.dpid].push({
                            value: e.route_section,
                            label: e.route_section
                        });
                    } else {
                        tempRouteByPointRepo[e.dpid] = [{
                            value: e.route_section,
                            label: e.route_section
                        }];
                    }
                    var temp = {
                        label: e.route_section,
                        value: e.route_section,
                    };
                    tempRoutes.push(temp);
                });

                setRegionRepo(tempRegionRepo);
                setAreaByRegionRepo(tempAreaByRegionRepo);
                setHouseByRegionRepo(tempHouseByRegionRepo);
                setHouseByAreaRepo(tempHouseByAreaRepo);
                setTerritoryByHouseRepo(tempTerritoryByHouseRepo);
                setPointByRegionRepo(tempPointByRegionRepo);
                setPointByAreaRepo(tempPointByAreaRepo);
                setPointByHouseRepo(tempPointByHouseRepo);
                setPointByTerritoryRepo(tempPointByTerritoryRepo);
                setRouteByPointRepo(tempAreaByRegionRepo);


                setRegions(tempRegions);
                setAreas(tempAreas);
                setHouse(tempHouses);
                setTerritory(tempTerritory);
                setPoints(tempPoints);
                setRoutes(tempRoutes);
                
                setSelectedRegion(tempRegions);
                setSelectedArea(tempAreas);
                setSelectedHouse(tempHouses);
                setSelectedTerritory(tempTerritory);
                setSelectedPoint(tempPoints);
                setSelectedRoute(tempRoutes);

            }
            setIsLoading(false);
        }
    }, [selected_fi])
    const [userType, setUserType] = useState(localStorage.getItem('cr_user_type'));
    return (
        isLoading ? (<div>
            <div style={{ textAlign: "center" }}>
                <Loader
                    type="Rings"
                    color="#00BFFF"
                    height={100}
                    width={100}


                />
            </div>
        </div>) : (
                <Card className="bg-light-primary">
                    <Card.Body className="" style={{padding: "1rem"}}>                        
                        <div className="row">
                            <div className="col-12 row">
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>From Date</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <TextField
                                                id="from_date"                                
                                                type="date" 
                                                name="from_date"
                                                onChange={(event) => {setFromDate(event.target.value); props.updateFromDate(event.target.value);}}
                                                defaultValue={fromDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>To Date</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <TextField
                                                id="to_date"                                
                                                type="date" 
                                                name="to_date" 
                                                onChange={(event) => {setToDate(event.target.value); props.updateToDate(event.target.value);}}
                                                defaultValue={toDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Region</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <select className={styles.selectInput} onChange={onChangeRegion}>
                                                {regions.map((data) => (
                                                    <option value={data.value}>{data.label}</option>
                                                )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Area</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <select className={styles.selectInput} onChange={onChangeArea}>
                                                {areas.map((data) => (
                                                    <option value={data.value}>{data.label}</option>
                                                )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>House</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <select className={styles.selectInput} onChange={onChangeHouse}>
                                                {house.map((data) => (
                                                    <option value={data.value}>{data.label}</option>
                                                )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-1" style={{paddingTop: 22}}>
                                    <Button variant="contained" color="primary" onClick={getRouteSections}>
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )
    );
}

export default DropdownMenuGroup;