import React, { useState, useEffect } from "react";
import { MDBDataTableV5 } from "mdbreact";

export default function Datatable(props) {
  const [datatable, setDatatable] = useState(props.data);
  const [topSearch, setTopSearch] = useState(true);
  const [isMobile, setIsMobile] = useState();

  useEffect(() => {
    setDatatable(props.data);
  }, [props.data]);

  useEffect(() => {
    setTopSearch(props.topSearch);
  }, [props.topSearch]);

  useEffect(() => {
    if (window.matchMedia("(max-width: 769px)").matches) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [])
  return (
    <>
      {isMobile ?
        <MDBDataTableV5
          hover
          striped
          entriesOptions={[5, 20, 25, 50, 100]}
          entries={props.rowsToShow ? props.rowsToShow : 5}
          pagesAmount={4}
          data={datatable}      
          searchTop={topSearch}
          searchBottom={false}
          barReverse
          fullPagination 
          materialSearch
          scrollX
        />
        :
        <MDBDataTableV5
          hover
          striped
          entriesOptions={[5, 20, 25, 50, 100]}
          entries={props.rowsToShow ? props.rowsToShow : 5}
          pagesAmount={4}
          data={datatable}      
          searchTop={topSearch}
          searchBottom={false}
          barReverse
          fullPagination 
          materialSearch
        />
      }
    </>
  );
}
