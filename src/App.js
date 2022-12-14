import DatePicker from 'react-datepicker';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sendDate, setSendDate] = useState("")

  const format = (dateToFormat) => {
    var mm = dateToFormat.getMonth() + 1; // getMonth() is zero-based
    var dd = dateToFormat.getDate();
  
    return [dateToFormat.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join('-');
  };

  const handleDelete = async(event) => {
    event.preventDefault();
    const response = await axios({
      method: "get",
      url: `http://195.210.47.140:8000/deleteForecastPlannerItemById?itemId=${event.target.dataset.id}`
    }).then((response)=>{return response.data})
    setTable(table.filter((e)=> e.id != event.target.dataset.id))
  }

  const handleSend = async(event) => {
    event.preventDefault();
    setTable([...table, {id: table[table.length-1].id+1, dateOfSend: format(sendDate), forecastStart: format(startDate), forecastEnd: format(endDate)}])
    const response = await axios({
      method: "get",
      url: `http://195.210.47.140:8000/addNewForecastPlannerItem?dateOfSend=${format(sendDate)}&forecastStart=${format(startDate)}&forecastEnd=${format(endDate)}`
    }).then((response)=>{return response.data})
  }

  async function fetchData(){
    let api = await fetch('http://195.210.47.140:8000/findAllForecastPlanerItems')
    let apijson = await api.json()
    setTable(apijson)
  }
  const [table, setTable] = useState([]);
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="App">
      <div className="table-container">
        <table className="GeneratedTable">
          <thead>
            <tr>
              <th>Id</th>
              <th>Date of Send</th>
              <th>Forecast Period</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {table.map((e, id)=>{
              return <tr key={id}>
                  <td>{e.id}</td>
                  <td>{e.dateOfSend}</td>
                  <td>{e.forecastStart}--{e.forecastEnd}</td>
                  <td data-id={e.id} onClick={handleDelete}><FontAwesomeIcon icon={faTrash}/></td>
                </tr>
            })}
          </tbody>
        </table>
        <div className="input-fields">
          <div className="sendDate">
            <label htmlFor="sendDate">Send Date:</label>
            <DatePicker 
              name='sendDate'
              selected={sendDate}
              onChange={(date) => setSendDate(date)}
            />
          </div>
          <div className="rangedDate">
            <label htmlFor="startDate">From</label>
            <DatePicker
              name='startDate'
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <label htmlFor="endDate">to</label>
            <DatePicker
              name='endDate'
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
          <button onClick={handleSend}>Send!</button>
        </div>
      </div>

    </div>
  );
}

export default App;
