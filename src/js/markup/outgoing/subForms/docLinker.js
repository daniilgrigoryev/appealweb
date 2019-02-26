import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Button,Input,Radio} from 'element-react'

import AppealTable from '../../table/table.js'
import {post} from '../../../services/ajax.js'
import {getSessionId} from '../../../selectors/common.js'

const desc = {
  alias: 'APPEAL_LIST'
}

class DocLinker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      npost:     null,
      fio:       null,
      numberIn:  null,
      numberOut: null,
      target:    'IN_APPEAL',

      rows: [],
      selected: [],

      searchDesc : {}
    }

    this.getSelected = null;

    this.registerGetSelected = this.registerGetSelected.bind(this);
    this.onInput  = this.onInput.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSetTarget = this.onSetTarget.bind(this);
  };

  registerGetSelected(outerGetSelected){
    this.getSelected = outerGetSelected;
  }

  getSearchDesc(){
    const {npost,fio,numberIn,numberOut} = this.state;
    return {npost,fio,numberIn,numberOut}; 
  }

  onSearch(){
    const searchDesc = this.getSearchDesc();
    this.setState({searchDesc});
  }

  onSetTarget(target){
    this.setState({target});
  }

  onInput(id){ 
    return (value)=>this.setState({[id]:value});
  }

  render (){
    const S = this.state;
    const {target,searchDesc} = this.state; 
    const {dialogLink,dialogClose} = this.props;
 
    const performLink = ()=>{
        const args = this.getSelected();
        dialogLink(args);
    }

    const searchEmpty = _.isEmpty(searchDesc);
    const TABLE = searchEmpty 
      ? (<div><h1>Условие для поиска не задано</h1></div>)
      : (<AppealTable sid={this.props.sid} desc={Object.assign({},searchDesc,desc)} registerGetSelected = {this.registerGetSelected} />);

    return (
        <div>
          <table>
            <tbody>
              <tr>
                <td>№ постановления</td>
                <td><Input id='npost' value={S.npost} onChange={this.onInput('npost')} /></td>
                <td>ФИО/Организация</td>
                <td><Input id='fio' value={S.fio} onChange={this.onInput('fio')} /></td>
                <td><Button onClick={this.onSearch}>Поиск</Button></td>
              </tr>
              <tr>
                <td>Входящий №</td>
                <td><Input id='numberIn' value={S.numberIn} onChange={this.onInput('numberIn')} /></td>
                <td>Исходящий №</td>
                <td><Input id='numberOut' value={S.numberOut} onChange={this.onInput('numberOut')} /></td>
                <td><Button onClick={performLink}>Связать</Button></td>
              </tr>
              <tr>
                <td>Поиск по</td>
                <td><Radio value='IN_APPEAL'  checked={target === 'IN_APPEAL' } onChange={this.onSetTarget} >Входящим обращениям</Radio></td>
                <td><Radio value='OUT_APPEAL' checked={target === 'OUT_APPEAL'} onChange={this.onSetTarget} >Исходящим обращениям</Radio></td>
                <td><Radio value='INTRA_DOCS' checked={target === 'INTRA_DOCS'} onChange={this.onSetTarget} >Служебным документам</Radio></td>
                <td><Button onClick={dialogClose}>Закрыть</Button></td>
              </tr>
            </tbody>
          </table>

          {TABLE}          

        </div>
    ); //
  }  
}; //


const state2props = (state) => {
  return {sid:getSessionId(state)};
}

export default connect(state2props)(DocLinker)