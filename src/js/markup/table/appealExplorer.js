import React, { Component } from 'react';
import AppealTable from './table.js'
import {getSessionId} from '../../selectors/common.js'
import { connect } from 'react-redux'

const desc = {
  alias: 'APPEAL_LIST'
}

class AppealExplorer extends React.Component {

  render() {
    return (
      <div>
        <div className = 'overTable' style={{height:'300px'}}>
        </div>
        <AppealTable sid={this.props.sid} desc={desc} />
      </div>
    )
  }
}

const state2props = (state) => {
  return {sid:getSessionId(state)};
}

export default connect(state2props)(AppealExplorer);