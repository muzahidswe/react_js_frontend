import React, {Fragment, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from "../../constants/constants";
import Loader from "react-loader-spinner";
import DropdownMenuGroup from "../helper/top_dropdown";
import styled from "styled-components";
import { fileSubmitScopeoutlet } from '../../services/fileUploadServices';
import { useAlert } from 'react-alert';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const DATA_TABLE_URL = baseURL+'scope-outlets';
const DELETE_URL = baseURL+'delete-scope-outlet';

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const FilterComponent = ({ filterText, onFilter, searchClick }) => (
  <>
    {/* <TextField
      id="search"
      type="text"
      placeholder="Search"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    /> */}

    <Paper style={{
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 300,
    }}>

      <InputBase
        style={{
          marginLeft: 8,
          flex: 1,
        }}
        placeholder="Search By Outlet Code"
        inputProps={{ 'aria-label': 'Search By Outlet Code' }}
        value={filterText}
        onChange={onFilter}
      />
      <Divider style={{
        width: 1,
        height: 28,
        margin: 4,
      }} />
      <IconButton style={{ padding: 10, }} aria-label="Search" onClick={searchClick}>
        <SearchIcon />
      </IconButton>

    </Paper>
  </>
);


function ScopeOutletPreviewFi(props) {
    const alert = useAlert();
    
    const deleteScopeOutlet = (id) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You wont be able to revert this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDeleteOutlet(id),
                    className: "btn btn-danger"
                },
                {
                    label: 'No',
                    onClick: () => console.log('Click No'),
                    className: "btn btn-success"
                }
            ]
        });        
    }

    const confirmDeleteOutlet = (id) => {
        axios.post(`${DELETE_URL}`,{
            id: id
        }).then(res => {
            alert.success('Successfully deleted.');
            getUploadedDatas();
        }).catch(err => {
            alert.error('Something went wrong.');
            // setData({});
            // setTotalRows(0);
            // setHeaders([]);
        });
    }

    const columns = [
    {
        name: 'Point',
        selector: 'dp_name',
        sortable: true
    },
    {
        name: 'Outlet Code',
        selector: 'outlet_code',
    },
    {
        name: 'Outlet Name',
        selector: 'outlet_name',
        sortable: true
    },
    {
        name: 'Owner Name',
        selector: 'owner_name',
        sortable: true
    },
    {
        name: 'Phone No.',
        selector: 'phone',
        sortable: true
    },
    {
        name: 'Address',
        selector: 'address',
        sortable: true
    },
    {
        name: 'Action(s)',
        cell: row =><button onClick={()=>{deleteScopeOutlet(row.id)}} className="btn btn-danger btn-sm"><i className="fa fa-trash"></i></button>
    }
    ]

    const [headers, setHeaders] = useState([]);
    const [filterText, setFilterText] = React.useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const countPerPage = 10;

    const [totalRows, setTotalRows] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [dpids, setDpids] = useState([]);
    


    const [dhId, setDhId] = useState(0);
    const getUploadedDatas = () => {
        if(dpids.length > 0) {
            axios.post(`${DATA_TABLE_URL}?page=${page}&per_page=${countPerPage}`, 
                {dpids, filterText}
            ).then(res => {
                setData(res.data.data);
                setTotalRows(res.data.data.pagination.total);
                setHeaders(columns);
            }).catch(err => {
                setData({});
                setTotalRows(0);
                setHeaders([]);
            });
            setIsLoading(false);
        }
    };
    
    const handleSearch = (value) =>{
        if (value.selectedHouse) {
            let array = [];
            for (let i = 0; i < value.selectedHouse.length; i++) {
                array.push(value.selectedHouse[i].value);
            }
            setDhId(array);
        }else{
            getUploadedDatas();
        }
    }

    const handleDpidChange = (ids) => {
        setDpids(ids);
    };

    const searchClick = () => {
        getUploadedDatas();
    }

    const subHeader = React.useMemo(() => {
        return (
            <Fragment>
                <FilterComponent
                    searchClick={searchClick}
                    onFilter={(e) => {
                    setFilterText(e.target.value)

                    }}
                    filterText={filterText}
                />
            </Fragment>
        );
    }, [dpids, filterText]);

    useEffect(() => {
        getUploadedDatas();
    }, [page, dpids]);
    return (
        <Card className="m-5">
            <Card.Header>
                <h3 className="card-title">Scope Outlets</h3>                    
            </Card.Header>
            <Card.Body>
                <DropdownMenuGroup onDpidChange={handleDpidChange} isSearch={true} />
                {/*<DropdownMenuGroup 
                    onValueChange={handleSearch} 
                    visible={false}
                    handleSearch={handleSearch}
                />*/}
                {isLoading ? 
                    <div>
                        <div style={{ textAlign: "center" }}>
                            <Loader type="Rings" color="#00BFFF" height={100} width={100} />
                        </div>
                    </div> 
                : (
                    <DataTable
                        noHeader
                        columns={headers}
                        data={data.data}
                        highlightOnHover
                        pagination
                        paginationServer
                        subHeader
                        subHeaderComponent={subHeader}
                        paginationTotalRows={totalRows}
                        paginationPerPage={countPerPage}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setPage(page)}
                    />
                )}
            </Card.Body>
        </Card>
    )
}

export default ScopeOutletPreviewFi;