import React, { useState } from 'react';
import { parse } from 'papaparse';
import './App.css';

const App = () => {
  const [info, setInfo] = useState([]);

  const readText = async (data) => {
    const text = await data.text();
    const result = parse(text, { header: true });
    return result.data;
  }

  const isAgeInValid = (age) => {
    return age < 21 && !Number.isInteger(age);
  }

  const isDateValid = (date) => {
    const result = new Date(date);
    if (isNaN(result)) {
      return false;
    }
    return result.toLocaleDateString();
  }

  const isExperienceValid = (experience, age) => {

    return +experience >= 0 && +experience < +age;
  }

  const isIncomeValid = (income) => {
    if (Number.parseFloat(income) > 1000000) {
      return false;
    }

    return Number.parseFloat(income).toFixed(2);
  }


  return (
    <div className="container">
      <h1 className="title">Parse CSV</h1>
      <div className="inp-area">
        <input type="file"
         className="custom-input"
         accept=".csv"
         onChange={async(event) => {
           const file = event.target.files[0];
           const result = await readText(file);
           setInfo(result);
         }}
        />
      </div>

      {info.length > 0 && (
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
        {info.map((row, index, info) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              {row.fullName.trim()}
            </td>
            <td className={row.phone.length < 10 && "invalid"}>
              {`+1${row.phone.slice(-10)}`}
            </td>
            <td>{row.email}</td>
            <td className={isAgeInValid(row.age) && "invalid"}>
              {row.age}
            </td>
            <td className={!isExperienceValid(row.experience, row.age) && "invalid"}>
              {row.experience}
            </td>
            <td>
              {isIncomeValid(row.yearlyIncome) ? isIncomeValid(row.yearlyIncome) : row.yearlyIncome}
            </td>
            <td>
              {row.hasChildren === "" ? "FALSE" : row.hasChildren}
            </td>
            <td>
              {row.licenseStates}
            </td>
            <td className={!isDateValid(row.expirationDate) && "invalid"}>
              {isDateValid(row.expirationDate) ? isDateValid(row.expirationDate) : row.expirationDate}
            </td>
            <td>
              {row.licenseNumber}
            </td>
            <td>-</td>
          </tr>
          ))}
          </tbody>
          </table>
      )}
    </div>
  );
}

export default App;
