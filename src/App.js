import React, { useState } from 'react';
import { parse } from 'papaparse';
import './App.css';

const App = () => {
  const [info, setInfo] = useState([]);

  const readText = async (data) => {
    const text = await data.text();
    const result = parse(text, { header: true });
    console.log(result);
    return result.data;
  }

  return (
    <div className="container">
      <h1 className="title">Parse CSV</h1>
      <div className="inp-area">
        <input type="file"
         className="custom-input"
         accept=".csv"
         onChange={event => {
           const file = event.target.files[0];
           setInfo(readText(file));
         }}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Age</th>
            <th>Experience</th>
            <th>Yearly Income</th>
            <th>Has children</th>
            <th>License states</th>
            <th>Expiration date</th>
            <th>License number</th>
            <th>Duplicate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
            <td>test</td>
          </tr>
        </tbody>

      </table>

    </div>
  );
}

export default App;
