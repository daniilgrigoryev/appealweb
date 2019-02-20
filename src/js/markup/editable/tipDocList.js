import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {getSessionId} from '../../selectors/common.js'
import CrudTable from '../table/crudTable.js'
import * as F from '../table/fields.js'

const title='Типы документов'

const fields = [
	F.str('label','Название')
]

class TipDocList extends React.Component {
  render() {
    return <CrudTable sid={this.props.sid} fields={fields} columns={1} title={title} />;
  }//
}

const state2props = (state) => {
  return {sid: getSessionId(state)};
}

export default connect(state2props)(TipDocList);