import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import MultiSelect from "react-multi-select-component";
import { useEffect } from "react";
import { useState } from "react";
import FormSelect from "./formSelect";
import { getLocationsForDropDownTwo } from "../../services/helperService";
import dateFormat from "dateformat";

const initValue = {
  selectedRegion: [],
  selectedArea: [],
  selectedHouse: "",
  selectedTerritory: [],
  selectedPoints: [],
};
function TopDropdownTwo(props) {
  const [value, setValue] = useState(initValue);
  const [obj, setObj] = useState({});
  const [regions, setRegion] = useState([]);
  const [areas, setAreas] = useState([]);
  const [houses, setHouses] = useState([]);
  const [territory, setTerritory] = useState([]);
  const [points, setPoints] = useState([]);
  const [visible, setVisible] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState([]);

  const onChangeRegion = (name, val) => {
    setValue((prevState) => ({ ...prevState, [name]: val }));
    if (obj && obj.areas) {
      const areaData = obj.areas
        .map((area) => {
          if (val.some((v) => v.value === area.region)) {
            return { value: area.id, label: area.slug };
          }
        })
        .filter((area) => area);
      setAreas(areaData);
    }
  };

  const onChangeArea = (name, val) => {
    setValue((prevState) => ({ ...prevState, [name]: val }));
    const housesData = obj.companies
      .map((company) => {
        if (val.some((v) => v.value === company.area)) {
          return { value: company.id, label: company.name };
        }
      })
      .filter((house) => house);

    setHouses(housesData);
  };

  const onChangeHouses = (name, val) => {
    setValue((prevState) => ({ ...prevState, [name]: val }));
    const territoryData = obj.territory
        .map((td) => {
        if (val.some((v) => v.value === td.name)) {
            return { value: td.id, label: td.name };
        }
    })
    .filter((house) => house);
    setTerritory(territoryData);
    // if (obj && obj.territory) {
    //   const territoryData = obj.territory
    //     .filter((terr) => terr.company == val)
    //     .map((td) => ({ value: td.id, label: td.name }));
    //   setTerritory(territoryData);
    // }
  };

  const onChangeTerritory = (name, val) => {
    setValue((prevState) => ({ ...prevState, [name]: val }));
    const pointsData = obj.points
      .map((point) => {
        if (val.some((v) => v.value == point.territory)) {
          return { value: point.id, label: point.name };
        }
      })
      .filter((point) => point);
    setPoints(pointsData);
  };

  const onChangePoints = (name, val) => {
    setValue((prevState) => ({ ...prevState, [name]: val }));
  };

  const onChangeDate = (name, val) => {
      setValue((prevState) => ({ ...prevState, [name]: val }));
      props.onDateChange("date", val);
  }

  useEffect(() => {
    (async () => {
      const object = await getLocationsForDropDownTwo();

      if (object) {
        setObj(object);
        const regionData = object.regions.map((region) => ({
          label: region.slug,
          value: region.id,
        }));
        setRegion(regionData);

        const areaData = object.areas
        .map((area) => {
          return { value: area.id, label: area.slug };
        })
        .filter((area) => area);
        setAreas(areaData);

        const housesData = object.companies
        .map((company) => {
            return { value: company.id, label: company.name };
        })
        .filter((house) => house);

        setHouses(housesData);

        setValue({selectedRegion: regionData, selectedArea: areaData, selectedHouse: housesData});
        setSelectedRegion(regionData);
      } else {
        alert("empty");
      }
    })();
  }, []);

  useEffect(() => {
    if (props.onValueChange) props.onValueChange(value);
  }, [value]);

  /*  useEffect(() => {
    setVisible(false);
  }, [props.visible]); */

  return (
    <Card className="bg-light-primary">
      <Card.Body>
        <div className="row">
          <div className="col-md-2">
            <div className="row">
              <div className="col-md-12">
                <h6>Region</h6>
              </div>
              <div className="col-md-12">
                <MultiSelect
                  options={regions}
                  value={value.selectedRegion}
                  onChange={(value) => onChangeRegion("selectedRegion", value)}
                  labelledBy="Region"
                />
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="row">
              <div className="col-md-12">
                <h6>Area</h6>
              </div>
              <div className="col-md-12">
                <MultiSelect
                  options={areas}
                  value={value.selectedArea}
                  onChange={(value) => onChangeArea("selectedArea", value)}
                  labelledBy="Area"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-12">
                <h6>House</h6>
              </div>
              <div className="col-md-8">
                <MultiSelect
                  options={houses}
                  value={value.selectedHouse}    
                  onChange={(value) => onChangeHouses("selectedHouse", value)}
                  labelledBy="House"
                />
                {/*<FormSelect
                  name="selectedHouse"
                  data={houses || { value: "", label: "Select" }}
                  onChange={onChangeHouses}
                  selectedValue={value.selectedHouse}
                />*/}
              </div>
              <div className="col-md-2">
                        <button
                        className="btn btn-primary mr-20 ml-10"
                        onClick={props.handleSearch}
                    >
                        {" "}
                        Search
                    </button>
                </div>
            </div>
          </div>
          {props.visible && (
            <Fragment>
              <div className="col-md-2">
                <div className="row">
                  <div className="col-md-12">
                    <h6>Territory</h6>
                  </div>
                  <div className="col-md-12">
                    <MultiSelect
                      options={territory}
                      value={value.selectedTerritory}                                     
                      onChange={(value) =>
                        onChangeTerritory("selectedTerritory", value)
                      }
                      labelledBy="Territory"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <div className="row">
                  <div className="col-md-12">
                    <h6>Points</h6>
                  </div>
                  <div className="col-md-12">
                    <MultiSelect
                      options={points}
                      value={value.selectedPoints}
                      onChange={(value) =>
                        onChangePoints("selectedPoints", value)
                      }
                      labelledBy="Points"
                    />
                  </div>                   
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default TopDropdownTwo;
