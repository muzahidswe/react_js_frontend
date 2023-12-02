import React, { useEffect, useState } from "react";
import { getLocationsForReport } from "../../services/helperService";
import { useAlert } from 'react-alert'
import Loader from 'react-loader-spinner'
import Select from 'react-select'
import { Card } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import Button from '@material-ui/core/Button';
import { TextField } from "@material-ui/core";

function DropdownMenuGroup(props) {
    const alert=  useAlert();
    const [isLoading, setIsLoading] = useState(true);


    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState([]);
    const [selectedTerritory, setSelectedTerritory] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState([]);
    const [selectedOutlets, setSelectedOutlets] = useState([]);

    const [regions, setRegions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [house, setHouse] = useState([]);
    const [territory, setTerritory] = useState([]);
    const [points, setPoints] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [outlets, setOutlets] = useState([]);

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
    const [outletByRouteRepo, setOutletByRouteRepo] = useState({});

    const [tillDate, setTillDate] = useState(`${new Date().getFullYear()}-01-01`);

    const getOutlets = () => {
        var outletToBeSearched = [];
        if (selectedOutlets.length > 0) {
            selectedOutlets.forEach(e => {
                outletToBeSearched.push(e.value);
            })
        }
        var dpids = [];
        if (selectedPoint.length > 0) {
            selectedPoint.forEach(e => {
                dpids.push(e.value);
            })
        }
        props.onSearch(dpids, outletToBeSearched, tillDate);
    }


    const onChangeRegion = (val) => {
        if (val.length > 0) {
            var tempArea = [];
            var tempHouse = [];
            var tempTerritory = [];
            var tempPoint = [];
            val.forEach(e => {
                var tempA = areaByRegionRepo[e.value];
                var tempH = houseByRegionRepo[e.value];
                var tempP = pointByRegionRepo[e.value];
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

            setSelectedRegion(val);
            setSelectedArea(tempArea);
            setSelectedHouse(tempHouse);
            setSelectedTerritory(tempTerritory);
            setSelectedPoint(tempPoint);

            setAreas(tempArea);
            setHouse(tempHouse);
            setTerritory(tempTerritory);
            setPoints(tempPoint);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse(tempPoint);
            }

        } else {
            setSelectedRegion([]);
            setSelectedArea([]);
            setSelectedHouse([]);
            setSelectedTerritory([]);
            setSelectedPoint([]);

            setAreas([]);
            setHouse([]);
            setTerritory([]);
            setPoints([]);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse([]);
            }
        }
    }


    const onChangeArea = (val) => {
        if (val.length > 0) {

            var tempHouse = [];
            var tempTerritory = [];
            var tempPoint = [];
            val.forEach(e => {


                var tempH = houseByAreaRepo[e.value];
                var tempP = pointByAreaRepo[e.value];
                var tempT = [];
                tempH.forEach(f => {
                    var tempTT = territoryByHouseRepo[f.value];
                    tempT.push(...tempTT);
                })


                tempHouse.push(...tempH);
                tempTerritory.push(...tempT);
                tempPoint.push(...tempP);



            });


            setSelectedArea(val);
            setSelectedHouse(tempHouse);
            setSelectedTerritory(tempTerritory);
            setSelectedPoint(tempPoint);


            setHouse(tempHouse);
            setTerritory(tempTerritory);
            setPoints(tempPoint);

            if (!props.isSearch) {
                handleChangeWhenisSearchFalse(tempPoint);
            }
        } else {

            setSelectedArea([]);
            setSelectedHouse([]);
            setSelectedTerritory([]);
            setSelectedPoint([]);


            setHouse([]);
            setTerritory([]);
            setPoints([]);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse([]);
            }
        }
    }



    const onChangeHouse = (val) => {

        if (val.length > 0) {
            let tempTerritory = [];
            let tempPoint = [];
            val.forEach(e => {

                const tempTArray = territoryByHouseRepo[e.value];

                const tempPArray = pointByHouseRepo[e.value];
                if (typeof tempTArray !== 'undefined') {
                    tempTerritory.push(...tempTArray);
                }
                
                tempPoint.push(...tempPArray);

            })
            setSelectedHouse(val);
            setSelectedTerritory(tempTerritory);
            setSelectedPoint(tempPoint);

            setTerritory(tempTerritory);
            setPoints(tempPoint);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse(tempPoint);
            }
        } else {

            setSelectedHouse([]);
            setSelectedTerritory([]);
            setSelectedPoint([]);
            setTerritory([]);
            setPoints([]);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse([]);
            }

        }
    }

    const onChangeTerritory = (val) => {
        if (val.length > 0) {

            let tempPoint = [];

            val.forEach(e => {


                const tempPArray = pointByTerritoryRepo[e.value];

                tempPoint.push(...tempPArray);

            })

            setSelectedTerritory(val);
            setSelectedPoint(tempPoint);
            setPoints(tempPoint);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse(tempPoint);
            }
        } else {

            setSelectedTerritory([]);
            setSelectedPoint([]);
            setPoints([]);
            if (!props.isSearch) {
                handleChangeWhenisSearchFalse([]);
            }
        }
    }

    const onChangePoint = (val) => {
        setSelectedPoint(val);
        if (val.length > 0) {
            let tempRoute = [];

            val.forEach(e => {
                const tempPArray = routeByPointRepo[e.value];
                tempRoute.push(...tempPArray);

            });
            setSelectedRoute(tempRoute);
        }
        if (!props.isSearch) {
            handleChangeWhenisSearchFalse(val);
        }
    }

    const onChangeRoute = (val) => {
        setSelectedRoute(val);
        if (val.length > 0) {
            let tempOutlets = [];

            val.forEach(e => {
                const tempPArray = outletByRouteRepo[e.value];
                tempOutlets.push(...tempPArray);

            });
            setSelectedOutlets(tempOutlets);
        }else{
            setSelectedOutlets([]);
        }
    }

    const onChangeOutlets = (val) => {
        setSelectedOutlets(val);
    }

    const handleChangeWhenisSearchFalse = (val) => {
        if (!props.isSearch) {
            var dpids = [];
            if (val.length > 0) {
                val.forEach(e => {
                    dpids.push(e.value);
                })
            }
            //props.onDpidChange(dpids);
        }
    }

    useEffect(() => {
        (async () => {
            const locations = await getLocationsForReport();
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
                var tempOutletByRouteRepo = {};

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

                var tempOutlets = [];
                locations.outlets.forEach(e => {
                    if (e.route_section in tempOutletByRouteRepo) {
                        tempOutletByRouteRepo[e.route_section].push({
                            value: e.id_outlet,
                            label: e.outlet_code
                        });
                    } else {
                        tempOutletByRouteRepo[e.route_section] = [{
                            value: e.id_outlet,
                            label: e.outlet_code
                        }];
                    }
                    var temp = {
                        label: e.outlet_code,
                        value: e.id_outlet,
                    };
                    tempOutlets.push(temp);
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
                setOutletByRouteRepo(tempOutletByRouteRepo);

                setRegions(tempRegions);
                setAreas(tempAreas);
                setHouse(tempHouses);
                setTerritory(tempTerritory);
                setPoints(tempPoints);
                setRoutes(tempRoutes);
                setOutlets(tempOutlets);
                
                setSelectedRegion(tempRegions);
                setSelectedArea(tempAreas);
                setSelectedHouse(tempHouses);
                setSelectedTerritory(tempTerritory);
                setSelectedPoint(tempPoints);
                setSelectedRoute(tempRoutes);
                setSelectedOutlets(tempOutlets);

            }
            setIsLoading(false);
        })()
    }, [])
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
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Till Date</h6>
                                        </div>
                                        <div className="col-md-12">
                                            <TextField
                                                id="till_date"                                
                                                type="date" 
                                                name="till_date"
                                                onChange={(event) => {setTillDate(event.target.value)}}
                                                defaultValue={tillDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Region</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={regions}
                                                value={selectedRegion}
                                                onChange={onChangeRegion}
                                                labelledBy="Region"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Area</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={areas}
                                                value={selectedArea}
                                                onChange={onChangeArea}
                                                labelledBy="Area"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>House</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect style={{ textAlign: "left" }}
                                                options={house}
                                                value={selectedHouse}
                                                onChange={onChangeHouse}
                                                labelledBy="House"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-11 row" style={{paddingTop: "1%"}}>      
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Territory</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={territory}
                                                value={selectedTerritory}
                                                onChange={onChangeTerritory}
                                                labelledBy="Territory"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Point</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={points}
                                                value={selectedPoint}
                                                onChange={onChangePoint}
                                                labelledBy="Point"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Route/Section</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={routes}
                                                value={selectedRoute}
                                                onChange={onChangeRoute}
                                                labelledBy="Point"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h6>Outlets</h6>
                                        </div>
                                        <div className="col-md-12">

                                            <MultiSelect
                                                options={outlets}
                                                value={selectedOutlets}
                                                onChange={setSelectedOutlets}
                                                labelledBy="Outlet"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                            <div className="col-md-1" style={{paddingTop:"2.5%"}}>
                                <Button variant="contained" color="primary" onClick={getOutlets} style={{ marginTop: 10 }}>
                                    Search
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            )
    );

}

export default DropdownMenuGroup;