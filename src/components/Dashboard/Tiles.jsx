import React, { useEffect, useState } from "react";

function Tiles(props) {

    const [number, setNumber] = useState("");

    useEffect(() => {
        
    }, []);
    
     return (
        <>
            <div className={"card card-custom " +props.bgColorClass+ " gutter-b"} style={{"height": "130px"}}>
                <div className="card-body d-flex flex-column p-0">
                    <div className="flex-grow-1 card-spacer-x pt-6">
                        <div className="text-inverse-danger font-weight-boldest font-size-h4">{props.title}</div>
                        <div className="text-inverse-danger font-weight-bolder font-size-h2">{props.subtitle}</div>
                    </div>
                    <div id="kt_tiles_widget_2_chart" className="card-rounded-bottom" style={{"height": "50px"}}></div>
                </div>
            </div>
        </>
    );
}
export default Tiles;