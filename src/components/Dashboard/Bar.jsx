import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function Bar(props) {

    const [options, setOptions] = useState({
        series: [
            {
                name: props.data.name,
                data: props.data.data
            }
        ],
        options: {
            chart: {
                id: "basic-bar",
                toolbar: {
                    show: true,
                    offsetX: 0,
                    offsetY: 0,
                    tools: {
                        download: '<img style="width: 100%;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1LjU4MyA0NS41ODMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTIyLjc5MywxMi4xOTZjLTMuMzYxLDAtNi4wNzgtMi43MjktNi4wNzgtNi4wOTlDMTYuNzE1LDIuNzMsMTkuNDMyLDAsMjIuNzkzLDBjMy4zNTMsMCw2LjA3MywyLjcyOSw2LjA3Myw2LjA5NyAgICBDMjguODY2LDkuNDY2LDI2LjE0NSwxMi4xOTYsMjIuNzkzLDEyLjE5NnoiIGZpbGw9IiMzOWIwZGYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQk8cGF0aCBkPSJNMjIuNzk0LDI4Ljg4OWMtMy4zNjEsMC02LjA3OS0yLjcyOS02LjA3OS02LjA5OWMwLTMuMzY2LDIuNzE3LTYuMDk5LDYuMDc4LTYuMDk5YzMuMzUzLDAsNi4wNzMsMi43MzIsNi4wNzUsNi4wOTkgICAgQzI4Ljg2NiwyNi4xNjIsMjYuMTQ0LDI4Ljg4OSwyMi43OTQsMjguODg5eiIgZmlsbD0iIzM5YjBkZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPgoJCTxwYXRoIGQ9Ik0yMi43OTQsNDUuNTgzYy0zLjM2MSwwLTYuMDc5LTIuNzI5LTYuMDc5LTYuMDk5czIuNzE3LTYuMDk4LDYuMDc4LTYuMDk4YzMuMzUzLTAuMDAyLDYuMDczLDIuNzI5LDYuMDczLDYuMDk4ICAgIFMyNi4xNDQsNDUuNTgzLDIyLjc5NCw0NS41ODN6IiBmaWxsPSIjMzliMGRmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />',
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset: true | '<img src="/static/icons/reset.png" width="20">',
                        customIcons: []
                    },
                    export: {
                        csv: {
                            filename: undefined,
                            columnDelimiter: ',',
                            headerCategory: 'category',
                            headerValue: 'value',
                            dateFormatter(timestamp) {
                            return new Date(timestamp).toDateString()
                            }
                        },
                        svg: {
                            filename: undefined,
                        },
                        png: {
                            filename: undefined,
                        }
                    },
                    autoSelected: 'zoom' 
                }
            },
            xaxis: {
                categories: props.data.categories
            }
        }
    });

    useEffect(() => {
        
    }, []);
    
     return (
        <>
            <Chart
                options={options.options}
                series={options.series}
                type="bar"
                width="500"
            />            
        </>
    );
}
export default Bar;