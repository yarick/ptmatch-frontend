import React, { Component } from 'react';
import ListRecordMatchingSystems from '../components/ListRecordMatchingSystems';
import NewRecordMatchingSystem from '../components/NewRecordMatchingSystem';
import ListRecordSets from '../components/ListRecordSets';

class RecordMatchingSystems extends Component {
  
  render() {
    return (        
    <div className="container">
      <ListRecordMatchingSystems/>
      <NewRecordMatchingSystem/>
      <ListRecordSets/>
    </div>
    );
  }
}

RecordMatchingSystems.displayName = 'RecordMatchingSystems';

export default RecordMatchingSystems;