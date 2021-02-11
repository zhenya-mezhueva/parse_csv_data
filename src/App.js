import React, { useState } from 'react';
import { parse } from 'papaparse';
import { camelCase } from "camel-case";

import './App.css';

const App = () => {
  const [highlighted, setHighlighted] = useState(false);
  const [info, setInfo] = useState([]);
  const [error, setError] = useState(false);

  const readText = async (data) => {
    if (data.type === "text/csv") {
      const text = await data.text();
      const result = parse(text, {
        header: true,
        transform: function (value) {
          return value.trim();
        },
        transformHeader: function (header) {
          return camelCase(header);
        }
      });

      if (result.data.some(person => !person.fullName || !person.email || !person.phone)) {
        return false;
      }
      return result.data;
    }
    return false;
  }

  const isAgeInValid = (age) => {
    return age < 21 && !Number.isInteger(age);
  }

  const isDateValid = (date) => {
    const format1 = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
    const format2 = /^\d{4}[\-](0?[1-9]|1[0-2])[\-](0?[1-9]|[12][0-9]|3[01])$/;
    const currentDate = new Date();

    if (date.match(format1) || date.match(format2)) {
      return new Date(date) > currentDate;
    }
 }

  const formatDate = (date) => {
    if (isDateValid(date)) {
      const result = new Date(date);
      return result.toLocaleDateString();
    }

    return date;
  }

  const isExperienceValid = (experience, age) => {

    return +experience >= 0 && +experience < +age;
  }

  const isIncomeValid = (income) => {
    if (Number.parseFloat(income) > 1000000 || Number.parseFloat(income) < 0) {
      return false;
    }

    return Number.parseFloat(income).toFixed(2);
  }

  const isChildrenValid = (hasChildren) => {
    return hasChildren === "FALSE" || hasChildren === "" || hasChildren === "TRUE";
  }

  const isLicenseNumberValid = (licenseNumber) => {
    const licenseFormat = /^[a-zA-Z0-9]{6}$/;

    return licenseNumber.match(licenseFormat);
  }

  const formatLicenseState = (states) => {
    const result = states.split(' ').map(state =>
     state.length > 2 ? state.slice(0, 2).toUpperCase() : state.toUpperCase()
    );
    return result.join(' | ');
  }

  const findDuplicates = (people, index, phone, email) => {
    const normalizeCase = (data) => data.toLowerCase();
    const normalizePhone = (data) => data.slice(-10);
    const duplicates = [];

    const emailDuplicate = people.findIndex(
        (person, current) => normalizeCase(person.email) === normalizeCase(email) && current !== index
    );
    const phoneDuplicate = people.findIndex(
        (person, current) => normalizePhone(person.phone) === normalizePhone(phone) && current !== index
    );

    if (phoneDuplicate !== -1) {
      duplicates.push(`phone - ${phoneDuplicate + 1}`);
    }

    if (emailDuplicate !== -1) {
      duplicates.push(`email - ${emailDuplicate + 1}`);
    }

    return duplicates.join(", ");
  }


  return (
    <div className="container">
      <h1 className="title">Import Contacts</h1>
      <div
        className={highlighted ? "drop drop--active" : "drop"}
        onDragEnter={() => {
          setHighlighted(true);
        }}
        onDragLeave={() => {
          setHighlighted(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={async(event) => {
          event.preventDefault();
          setHighlighted(false);
          const file = event.dataTransfer.files[0];

          const result = await readText(file);
          if (result) {
            setInfo(current => [...current, ...result]);
            setError(false);
            return;
          }
          setError(true);
        }}
      >
        DROP FILE HERE
      </div>

      {error && (
        <div className="error">Invalid file format</div>
      )}

      {info.length !== 0 && (
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
          <th>Duplicate with</th>
        </tr>
        </thead>
        <tbody>
        {info.map((person, index, info) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>
              {person.fullName}
            </td>
            <td className={person.phone.length < 10 && "invalid"}>
              {`+1${person.phone.slice(-10)}`}
            </td>
            <td>{person.email}</td>
            <td className={isAgeInValid(person.age) && "invalid"}>
              {person.age}
            </td>
            <td className={!isExperienceValid(person.experience, person.age) && "invalid"}>
              {person.experience}
            </td>
            <td>
              {isIncomeValid(person.yearlyIncome) ? isIncomeValid(person.yearlyIncome) : person.yearlyIncome}
            </td>
            <td className={!isChildrenValid(person.hasChildren) && "invalid"}>
              {person.hasChildren === "" ? "FALSE" : person.hasChildren}
            </td>
            <td>
              {formatLicenseState(person.licenseStates)}
            </td>
            <td className={!isDateValid(person.expirationDate) && "invalid"}>
              {formatDate(person.expirationDate)}
            </td>
            <td className={!isLicenseNumberValid(person.licenseNumber) && "invalid"}>
              {person.licenseNumber}
            </td>
            <td>{findDuplicates(info, index, person.phone, person.email)}</td>
          </tr>
          ))}
          </tbody>
          </table>
      )}
    </div>
  );
}

export default App;
