import React, { Fragment } from "react";
import { Card } from "react-bootstrap";
import MultiSelect from "react-multi-select-component";
import { useEffect } from "react";
import { useState } from "react";
import FormSelect from "./formSelect";
import { getLocations } from "../../services/helperService";

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
    if (obj && obj.territory) {
      const territoryData = obj.territory
        .filter((terr) => terr.company == val)
        .map((td) => ({ value: td.id, label: td.name }));
      setTerritory(territoryData);
    }
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

  useEffect(() => {
    (async () => {
      const object = await getLocations();

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

        setValue({selectedRegion: regionData, selectedArea: areaData});
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
          <div className="col-md-2">
            <div className="row">
              <div className="col-md-12">
                <h6>House</h6>
              </div>
              <div className="col-md-12">
                <FormSelect
                  name="selectedHouse"
                  data={houses || { value: "", label: "Select" }}
                  onChange={onChangeHouses}
                  selectedValue={value.selectedHouse}
                />
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

          {props.dateVisible && (
              <div className="col-md-2">
                <div className="row">
                  <div className="col-md-12">
                    <h6>Select Year</h6>
                  </div>
                  <div className="col-md-12">
                    <select
                        className="form-control"
                        name="year"
                    >
                      <option value="">Select Year</option>
                      <option value="21">2021</option>
                      <option value="22">2022</option>
                      <option value="23">2023</option>
                      <option value="24">2024</option>
                      <option value="25">2025</option>
                      <option value="26">2026</option>
                      <option value="27">2027</option>
                      <option value="28">2028</option>
                      <option value="29">2029</option>
                      <option value="30">2030</option>

                      ))}
                    </select>
                  </div>
                </div>
              </div>
          )}

        </div>
      </Card.Body>
    </Card>
  );
}

export default TopDropdownTwo;
