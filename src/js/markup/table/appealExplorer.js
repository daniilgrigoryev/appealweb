import React, { Component } from 'react';
import {compose} from 'redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import AppealTable from './table.js'
import {getSessionId} from '../../selectors/common.js'
import { connect } from 'react-redux'
import {Button} from 'element-react'
import {post} from '../../services/ajax.js'
import {appealLoad} from '../../actions/common.js'
import Immutable from 'immutable'
import {relocate} from '../app/app.js'

const im = (obj)=> Immutable.fromJS(obj)

const desc = {
  alias: 'APPEAL_LIST'
}

const style = {textAlign:'center', width: '8em'};
const mapping = {
    ID: 'ИД',
    NUM:'Регистрационный номер', 
    DATE_REG:'Дата регистрации',  
    DATE_CONTROL:'Дата контроля',  
    FP_NAME :'Физ. лицо',
    JP_NAME :'ЮЛ наименование',
    PHONE :'телефон',
    EMAIL:'почта'
}

class AppealExplorer extends React.Component {

  openRow(rowData,column){
    const {dispatch,change,initialize} = this.props;
    const alias = 'CLAIM_GET';
    return ()=>{
      const claim_id = rowData.ID;
      post('rest/select',{alias,claim_id}).then(x=>{
        const raw = x.data.rows[0][0].value;
        const js = JSON.parse(raw);
        dispatch(initialize(im(js)));
        relocate('appeal_incoming');
      });
    }
  }

  render() {
    const body = (rowData, column)=>(<div>
      <Button onClick={this.openRow.bind(this)(rowData,column)}>Открыть</Button>
    </div>);
    const ac = {style,body};
    
    return (
      <div>
        <div className = 'overTable' style={{height:'300px'}}>
        </div>
        <AppealTable sid={this.props.sid} desc={desc} actionCol={ac} mapping={mapping} />
      </div>
    )
  }
}//

const state2props = (state) => {
  return {sid:getSessionId(state)};
}

export default compose(
    connect(state2props),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(AppealExplorer)

//export default connect(state2props)(AppealExplorer);