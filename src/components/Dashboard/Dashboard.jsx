import React, { useEffect, useState } from "react";
import { Card, Modal, Button } from 'react-bootstrap';
import Pie from "./Pie";
import Bar from "./Bar";
import Tiles from "./Tiles";
import Loader from "react-loader-spinner";
import { dashboardData } from "../../services/dashboardService";
import { useAlert } from 'react-alert';
import { Link } from "react-router-dom";

function Dashboard(props) {
    const alert = useAlert();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [backEndData, setBackEndData] = useState({});
    const [targetVsTaken, setTargetVsTaken] = useState({});
    const [totalCreditTaken, setTotalCreditTaken] = useState({});
    const [noOfBadDebtsOutlets, setNoOfBadDebtsOutlets] = useState(0);
    const getDashboardData = async () => {
        const dbData = await dashboardData();
        if (dbData.success) {
            setBackEndData(dbData.data);    
            setSuccess(true);        
        }else{
            alert.error('Something Went Wrong.')
        }      
    }
    useEffect(() => {
        getDashboardData();
    }, []);

    useEffect(() => {
        if (typeof backEndData.target_vs_credit_availed_outlets !== 'undefined') {
            setTargetVsTaken({
                labels: ["Target Outlets", "Credit Availed Outlets"],
                series: [backEndData.target_vs_credit_availed_outlets.target_outlets, backEndData.target_vs_credit_availed_outlets.credit_availed_outlets]
            });
        }
        if (typeof backEndData.credit_taken_in_last_ten_days !== 'undefined') {
            let data = [], categories = [];
            for (let i = 0; i < backEndData.credit_taken_in_last_ten_days.length; i++) {
                const e = backEndData.credit_taken_in_last_ten_days[i];
                data.push(e.amount);
                categories.push(e.date);
            }
            setTotalCreditTaken({
                data: data,
                categories: categories,
                name: 'Amount'
            });            
        }
        if (typeof backEndData.bad_debts_outlets !== 'undefined') {
            setNoOfBadDebtsOutlets(backEndData.bad_debts_outlets)
        }
        if (success) {
            setIsLoading(false);
        }
    }, [backEndData, success]);

    return (
        <>
            <div className="row m-5">
                <div className="col-6">
                    <Card className="card-custom card-stretch gutter-b">   
                        <Card.Header>
                            <span className="card-title font-weight-boldest">Target vs Credit Availed Outlets</span>
                            
                        </Card.Header>             
                        <Card.Body>
                            {isLoading ? (
                                <div style={{ textAlign: "center" }}>
                                    <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                                </div>
                            ) : <Pie
                                    data={targetVsTaken}
                                 />
                            }                    
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-6">
                    <Card className="card-custom card-stretch gutter-b">   
                        <Card.Header>
                            <span className="card-title font-weight-boldest">Total Credit Given in Market (Last 10 Days)</span>
                            
                        </Card.Header>             
                        <Card.Body>
                            {isLoading ? (
                                <div style={{ textAlign: "center" }}>
                                    <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                                </div>
                            ) : <Bar
                                    data={totalCreditTaken}
                                 />
                            }                    
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-3">
                    {isLoading ? (
                        <div style={{ textAlign: "center" }}>
                            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                        </div>
                    ) : 
                        <Link to="/bad-debts-outlets">
                            <Tiles 
                                bgColorClass={"bg-danger"}
                                title={"No. of Bad Debts Outlets"}
                                subtitle={noOfBadDebtsOutlets}
                            />
                        </Link>
                    }                    
                </div>
            </div>            
        </>
    );
}

export default Dashboard;
