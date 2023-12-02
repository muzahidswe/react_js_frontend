import React, { useState, useEffect } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const MapComponent = withScriptjs(withGoogleMap((props) =>{
  const dbData = props.dashBoardData ? props.dashBoardData : {};

  return (
    <GoogleMap
        defaultZoom={7}
        defaultCenter={{ lat: 23.8103, lng: 90.4125 }}
    >
        {props.isMarkerShown && <Marker position={{ lat: 23.8103, lng: 90.4125 }} />}
    </GoogleMap>
  )
}))

export default MapComponent;