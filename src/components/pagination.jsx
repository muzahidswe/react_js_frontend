import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import { getKyc } from "../services/fiPortalService";
import { MDBDataTableV5 } from "mdbreact";

const columns = [
  {
    label: "Region",
    field: "region",
    attributes: {
      "aria-controls": "DataTable",
      "aria-label": "Name",
    },
  },
  {
    label: "Area",
    field: "area",
  },
  {
    label: "House",
    field: "house",
    width: 400,
  },
  {
    label: "Territory",
    field: "territory",
  },
  {
    label: "Point",
    field: "point",
  },
  {
    label: "Account No.",
    field: "acc_no",
  },
  {
    label: "Outlet Code",
    field: "outlet_code",
  },
  {
    label: "Outlet Name",
    field: "outlet_name",
  },
  {
    label: "Owner Name",
    field: "owner_name",
  },
  {
    label: "Phone",
    field: "phone",
  },
  {
    label: "Address",
    field: "address",
  },
];
function Pagination(props) {
  let [pageCounter, setPageCounter] = useState(1);
  let [column, setColumn] = useState(columns);
  let [tableData, setTableData] = useState({
    columns: [],
    rows: [],
  });
  const handlePrevPage = () => {
    setPageCounter(pageCounter--);
  };

  const handleNextPage = () => {
    setPageCounter(pageCounter++);
  };

  async function getInitialContent() {
    const requestObject = {
      house_id: 1,
      per_page: 10,
      current_page: pageCounter,
    };
    const result = await getKyc(requestObject);
    const dynamicColumn = result[0].doc_info.map((doc) => {
      let cl = {};
      cl.label = doc.title;
      cl.field = `${doc.id}_checked`;
      return cl;
    });
    const new_list = result.map((res) => {
      res.doc_info.map((doc) => {
        res[`${doc.id}_checked`] = doc.checked;
      });
      delete res.doc_info;
      return res;
    });

    console.log("arrr  ", new_list);
    setTableData({
      ["columns"]: [...columns, ...dynamicColumn],
      ["rows"]: [...new_list],
    });
  }
  useEffect(() => {
    console.log("page counter ", pageCounter);
    const requestObject = {
      house_id: 1,
      per_page: 5,
      current_page: pageCounter,
    };

    async function getTableContent() {
      const result = await getKyc(requestObject);
      const new_list = result.map((res) => {
        res.doc_info.map((doc) => {
          res[`${doc.id}_checked`] = doc.checked;
        });
        delete res.doc_info;
        return res;
      });

      console.log("arrr2222  ", new_list);
      setTableData((prevState) => {
        return { ...prevState, ["rows"]: [...new_list] };
      });
    }
    getTableContent();
  }, [pageCounter]);

  useEffect(() => {
    //setPageCounter(pageCounter++)

    getInitialContent();
  }, []);

  useEffect(() => {
    console.log("column ", tableData);
  });

  /*  const addColumn = (result) => {
    const dynamicColumn = result[0].doc_info.map((doc) => {
      let cl = {};
      cl.label = doc.title;
      cl.field =  `${doc.id}_checked`;
      return cl;
    });
    setColumn((prevState) => {
      return [...prevState, ...dynamicColumn];
    });
  }; */
  return (
    <Fragment>
      <MDBDataTableV5
        hover
        maxHeight="300vh"
        info={false}
        data={tableData}
        paging={false}
        searchTop
        searchBottom={false}
        barReverse
      />
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li class={pageCounter === 1 ? "page-item disabled" : "page-item"}>
            <a class="page-link" onClick={handlePrevPage} /* tabindex="-1" */>
              Previous
            </a>
          </li>

          <li class="page-item">
            <a class="page-link" onClick={handleNextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}

export default Pagination;
