import React, { useState, useEffect } from 'react';
import { baseURL } from "../../constants/constants";
import axios from 'axios';
import Loader from "react-loader-spinner";
import { Card } from 'react-bootstrap';
import styles from './smsGateway.module.css';

export default function SmsGatewaySelection() {
  const [gatewayList, setGatewayList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    let response = await axios.post(`${baseURL}change-sms-gateway`, {active_gateway: event?.target.value});
    if(response?.data?.success == true) {
      getGatewayList();
    }
    setIsLoading(false);
  }

  const getGatewayList = async () => {
    try {
      setGatewayList([]);
      setIsLoading(true);
      let response = await axios.get(`${baseURL}sms-gateway-list`);
      if(response?.data?.success == true) {
        setGatewayList(response?.data?.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
    
  };

  useEffect(() => {
    getGatewayList();
  }, [])

  return (
    <>
      {isLoading ? 
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
        :
        <Card className="m-5">
          <Card.Header>
            <h3 className="card-title">Sms Gateway Selection</h3>                    
          </Card.Header>

          <Card.Body>
            {gatewayList.length > 0 &&
              <form onChange={handleSubmit}>

                {gatewayList.map(gateway => 
                  <div key={gateway?.id} className={styles.gatewayItem}>
                    <label for={gateway?.id} className={styles.label}>{gateway?.name}</label>

                    <input 
                      type="radio"
                      id={gateway?.id} 
                      name="sms_gateway" 
                      value={gateway?.id}
                      defaultChecked={gateway?.status == 1 ? 'checked' : ''}
                      className={styles.input}
                    />
                  </div>
                )}
              </form>
            }
          </Card.Body>
        </Card>
      }
    </>
  )
}