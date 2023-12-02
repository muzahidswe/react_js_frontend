import React, { Fragment, useEffect, useState, useMemo } from "react";
import { Card } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Swal from "sweetalert2";

const DATA_TABLE_DOWNLOAD_URL = baseURL + 'outstanding_report_download';

function OutstandingReport(props) {
  const [data, setData] = useState([]);
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const currentDate = (new Date().getDate() - 1).toString().padStart(2, '0');
  const [maxDate, setMaxDate] = useState(`${new Date().getFullYear()}-${currentMonth}-${currentDate}`);
  const [tillDate, setTillDate] = useState(`${new Date().getFullYear()}-${currentMonth}-${currentDate}`);

  const [isLoading, setIsLoading] = useState(true);
  const [dpids, setDpids] = useState([]);
  const getReportData = () => {
    // axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`,
    //     {dpids, filterText, dateFrom, dateTo}
    // )
    // .then(res => {
    //     console.log(res.data.data)
    //     setData(res.data.data);
    //     setTotalRows(res.data.data.pagination.total);
    //     setHeaders(columns);
    //     setTotalAmt(res.data.data.total_amount);
    // }).catch(err => {
    //     setData({});
    //     setTotalRows(0);
    //     setHeaders([]);
    //     setTotalAmt("0")
    // });
    setIsLoading(false);
  };

  const downloadDatas = async () => {
    var token = localStorage.getItem("token");
    setIsLoading(true);

    await axios.post(DATA_TABLE_DOWNLOAD_URL, {dpids, date: tillDate},
      {headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((res) => {
      if (res?.data?.success) {
        window.open(res?.data?.data, '_blank', 'noopener,noreferrer')
        setIsLoading(false);
      } else {
        setIsLoading(false);
        Swal.fire({
          title: "Error",
          text: res?.data?.message,
          icon: 'error'
      })
      }

    })
    .catch((err) => {
        setIsLoading(false);
    });
  }

  const handleDpidChange = (ids) => {
      setDpids(ids);
  };

  const searchClick = () => {
      getReportData();
  }

  useEffect(() => {
      getReportData();
  }, [dpids]);

  return (
    <Card className="m-5">
      <Card.Header>
          <div className="row">
              <h3 className="card-title">Outstanding Report</h3>
          </div>
      </Card.Header>

      <Card.Body>
        <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={false} />

        {isLoading ? (
          <div>
              <div style={{ textAlign: "center" }}>
                  <Loader type="Rings" color="#00BFFF" height={100} width={100} />
              </div>
          </div>
          )
          :
          (
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'end'
              }}
            >
              <div className="row">
                <div className="input-group col-md-3">
                  <span className="input-group-text">Date</span>
                  <input
                    type="date"
                    className="form-control  form-control-md form-control-solid"
                    defaultValue={tillDate}
                    max={maxDate}
                    onChange={(event) => {setTillDate(event.target.value)}}
                  />
                </div>

                <div className="col-md-9">
                  <button className="btn btn-success" onClick={downloadDatas}>Download Report</button>
                </div>
              </div>
            </div>
          )
        }
      </Card.Body>
    </Card>
    )
}

export default OutstandingReport;
