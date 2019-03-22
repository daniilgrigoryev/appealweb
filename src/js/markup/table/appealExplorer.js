import React, { Component } from 'react';
import {compose} from 'redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import AppealTable from './table.js'
import {getSessionId} from '../../selectors/common.js'
import { connect } from 'react-redux'
import {Button,Input} from 'element-react'
import {post} from '../../services/ajax.js'
import {appealLoad} from '../../actions/common.js'
import Immutable from 'immutable'
import {relocate} from '../app/app.js'
import {EInput} from  '../components/finput.js'
import {ESelect} from  '../components/select.js'
import {EAutocomplete} from  '../components/fautocomplete.js'
import {EPicker} from '../components/picker.js'
import mapping from '../../markup/appeal/appealContent/mapping.js'
import * as _ from 'lodash'

const MS = mapping.status;
const MB = mapping.basicData;
const MC = mapping.claimantData;

const timeOfs = new Date().getTimezoneOffset()*60*1000;

const im = (obj)=>Immutable.fromJS(obj)

const desc = {
  alias: 'APPEAL_LIST'
}

const style = {textAlign:'center', width: '8em'};
const mappingT = {
    //ID: 'ИД',
    NUM:'Регистрационный номер', 
    DATE_REG:'Дата регистрации',  
    //DATE_CONTROL:'Дата контроля',  
    FP_NAME :'Физ. лицо',
    JP_NAME :'ЮЛ наименование',
    PHONE :'Телефон',
    STAGE: 'Статус'
}

class AppealExplorer extends React.Component {

  constructor(props){
    super(props);
    const search = {};
    this.state = {search};
    this.where = {};
    this.whereKey = 0;

    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
  }

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

  search(){ //debugger;
    const w = Object.assign({},this.state.search);
    /*for (var key in w){
      if (w[key] instanceof Date){
        w[key]= new Date(w[key].getTime()+timeOfs);
      }
    }*/
    this.where = w;

    //debugger;

    this.whereKey = 'k'+new Date().getTime();
    this.forceUpdate();  
  }

  onChange(field){
    const {search} = this.state;
    return (val)=>{
      search[field]=val;
      this.setState({search});
    };
  }

  render() {
    const S = this.state.search;
    const noTable = _.isEmpty(this.where);
    const chg = this.onChange;

    const body = (rowData, column)=>(<div>
      <Button onClick={this.openRow.bind(this)(rowData,column)}>Открыть</Button>
    </div>);
    const ac = {style,body};

    return (
      <div>
        <div className = 'overTable' style={{height:'210px'}}>
          <table>
            <tbody>
              <tr>
                <td>Рег. номер</td>
                <td><Input value={S['reg_num']} onChange={chg('reg_num')} /></td>
                <td>Статус</td>
                <td><ESelect value={S[MS.STATUS.key]} dataKey={MS.STATUS.key}  onChange={chg(MS.STATUS.key)} /></td>
                <td><Button onClick={this.search}>Поиск</Button></td>
              </tr>
              <tr>
                <td>Физ лицо</td>
                <td><Input value={S['fl']} onChange={chg('fl')} /></td>
                <td>Исполнитель</td>
                <td><EAutocomplete value={S[MS.EXECUTOR.key]} dataKey={MS.EXECUTOR.key} onChange={chg(MS.EXECUTOR.key)} /></td>
              </tr>
              <tr>
                <td>Юр лицо</td>
                <td><Input value={S['ul']} onChange={chg('ul')} /></td>
                <td>Отдел</td>
                <td><EAutocomplete value={S[MS.DEPART.key]} dataKey={MS.DEPART.key} onChange={chg(MS.DEPART.key)} /></td>
              </tr>
              <tr>
                <td>Телефон</td>
                <td><Input value={S['phone']} onChange={chg('phone')} /></td>
                <td>Дата</td>
                <td><EPicker value={S['date']} datepicker='+' onChange={chg('date')}/></td>
              </tr>
              <tr>
                <td>Дата от</td>
                <td><EPicker value={S['date_from']} datepicker='+' onChange={chg('date_from')} /></td>
                <td>Дата до</td>
                <td><EPicker value={S['date_to']} datepicker='+' onChange={chg('date_to')} /></td>
              </tr>  
            </tbody>
          </table>
        </div>

        { noTable && <div><span></span></div>}
        {!noTable && <AppealTable key={this.whereKey} sid={this.props.sid} desc={desc} actionCol={ac} mapping={mappingT} hdelta={'360'} where={this.where} />}
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
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(AppealExplorer)

//export default connect(state2props)(AppealExplorer);