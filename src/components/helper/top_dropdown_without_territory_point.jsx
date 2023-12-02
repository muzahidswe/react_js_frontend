import React, { useEffect, useState } from "react";
import { getLocationsForDropDownTwo } from "../../services/helperService";
import { useAlert } from 'react-alert'
import Loader from 'react-loader-spinner'
import { Card } from 'react-bootstrap';
import MultiSelect from "react-multi-select-component";
import Button from '@material-ui/core/Button';
import dateFormat from "dateformat";
import styles from './topDropdownWithPhase.module.css';
import { useSelector } from "react-redux";

function DropdownMenuGroup(props) {
    const {selected_fi} = useSelector(state => state.fi);

    const alert=  useAlert();
    const [isLoading, setIsLoading] = useState(true);

    const [selectedRegion, setSelectedRegion] = useState([]);
    const [selectedArea, setSelectedArea] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [regions, setRegions] = useState([]);
    const [areas, setAreas] = useState([]);
    const [house, setHouse] = useState([]);

    const [regionRepo, setRegionRepo] = useState([]);
    const [areaByRegionRepo, setAreaByRegionRepo] = useState({});
    const [houseByRegionRepo, setHouseByRegionRepo] = useState({});
    const [houseByAreaRepo, setHouseByAreaRepo] = useState({});

    const getHouseIds = () => {
        var dhIds = [];
        if (selectedHouse.length > 0) {
            selectedHouse.forEach(e => {
                dhIds.push(e.value);
            })
        }

        props.onHouseChange(dhIds);
    }

    const onChangeRegion = (val) => {
        if (val.length > 0) {
            var tempArea = [];
            var tempHouse = [];
            val.forEach(e => {
                var tempA = areaByRegionRepo[e.value];
                var tempH = houseByRegionRepo[e.value];

                tempArea.push(...tempA);
                tempHouse.push(...tempH);
            });

            setSelectedRegion(val);
            setSelectedArea(tempArea);
            setSelectedHouse(tempHouse);

            setAreas(tempArea);
            setHouse(tempHouse);

            var dhIds = [];
            if (tempHouse.length > 0) {
                tempHouse.forEach(e => {
                    dhIds.push(e.value);
                })
            }
            props.onHouseChange(dhIds);
        } else {
            setSelectedRegion([]);
            setSelectedArea([]);
            setSelectedHouse([]);

            setAreas([]);
            setHouse([]);
        }
    }

    const onChangeArea = (val) => {
        if (val.length > 0) {
            var tempHouse = [];
            val.forEach(e => {
                var tempH = houseByAreaRepo[e.value];
                tempHouse.push(...tempH);
            });

            setSelectedArea(val);
            setSelectedHouse(tempHouse);

            setHouse(tempHouse);

            var dhIds = [];
            if (tempHouse.length > 0) {
                tempHouse.forEach(e => {
                    dhIds.push(e.value);
                })
            }
            props.onHouseChange(dhIds);
        } else {
            setSelectedArea([]);
            setSelectedHouse([]);

            setHouse([]);
        }
    }

    const onChangeHouse = (val) => {
        setSelectedHouse((prevState) => {
            return val;
        });

        var dhIds = [];
        if (val.length > 0) {
            val.forEach(e => {
                dhIds.push(e.value);
            })
        }
        props.onHouseChange(dhIds);
    }

    const onChangeDate = (val) => {
        setSelectedDate(val);
        props.onDateChange(val);
    }

    useEffect(async () => {
        if (selected_fi) {
            const locations = await getLocationsForDropDownTwo(selected_fi);

            if (!locations) {
                alert.error("Some Error Occurred");
            } else {            
                var tempRegionRepo = [];
                var tempAreaByRegionRepo = {};
                var tempHouseByRegionRepo = {};
                var tempHouseByAreaRepo = {};

                var tempRegions = [];
                locations.regions.forEach(e => {
                    tempRegionRepo.push({ value: e.id, label: e.slug });
                    var temp = {
                        label: e.slug,
                        value: e.id
                    }
                    tempRegions.push(temp);
                })
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
                })

                setRegionRepo(tempRegionRepo);
                setAreaByRegionRepo(tempAreaByRegionRepo);
                setHouseByRegionRepo(tempHouseByRegionRepo);
                setHouseByAreaRepo(tempHouseByAreaRepo);

                setRegions(tempRegions);
                setAreas(tempAreas);
                setHouse(tempHouses);

                setSelectedRegion(tempRegions);
                setSelectedArea(tempAreas);
                setSelectedHouse(tempHouses);
                
                var dhIds = [];
                if (tempHouses.length > 0) {
                    tempHouses.forEach(e => {
                        dhIds.push(e.value);
                    })
                }

                props.onHouseChange(dhIds);
            }
            setIsLoading(false);
        }
    }, [selected_fi])
    const [userType, setUserType] = useState(localStorage.getItem('cr_user_type'));
    return (
        isLoading ? (
            <div>
                <div style={{ textAlign: "center" }}>
                    <Loader
                        type="Rings"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>
            </div>) 
            : (
            <Card className="bg-light-primary">
                <Card.Body className="m-5">
                    <div className={styles.filterWrapper}>
                        <div>
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
                        
                        <div>
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

                        <div>
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

                        <div>
                            <div className="row">
                                <div className="col-md-12">
                                    <h6>Date</h6>
                                </div>
                                <div className="col-md-12">
                                <input
                                    type="date"
                                    className="form-control  form-control-md form-control-solid "
                                    value={dateFormat(selectedDate, "yyyy-mm-dd")}
                                    /*placeholder={dateFormat(new Date(), "yyyy-mm-dd")}*/
                                    onChange={(e) => onChangeDate(e.target.value)}
                                />
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-1">
                            <br />
                            <Button variant="contained" color="primary" onClick={props.handleSearch} style={{ marginTop: 10 }}>
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