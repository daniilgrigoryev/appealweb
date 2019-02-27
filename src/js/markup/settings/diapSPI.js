import * as _ from 'lodash'
import React from 'react'
import {post,get} from '../../services/ajax.js'
import {Input,Switch,InputNumber,DatePicker,Button} from 'element-react'

export default class DiapSPI extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      newRow: {},
      rows: []
    }

    this.onInput = this.onInput.bind(this);
    this.pushNewRow = this.pushNewRow.bind(this);
  }

  onInput(field,value){
    const {newRow} = this.state; 
    const newValue = Object.assign({},newRow,{[field]:value})
    this.setState({newRow:newValue});
  }

  pushNewRow(){
    const {newRow,rows} = this.state; 
    this.setState({
      newRow:{},
      rows: [...rows,newRow]
    });
  }

  render (){
    const {rows,newRow} = this.state;
    const chg =(field)=>(value)=>this.onInput(field,value);

    const EDITOR = (
      <tr>
        <td><Input       value={newRow.index}      onChange={chg('index')}      /></td>
        <td><DatePicker  value={newRow.date}       onChange={chg('date')}       /></td>
        <td><InputNumber value={newRow.diap_start} onChange={chg('diap_start')} /></td>
        <td><InputNumber value={newRow.diap_end}   onChange={chg('diap_end')}   /></td>
        <td></td>
        <td><Button onClick={this.pushNewRow}>+</Button></td>
        <td><Button>F</Button></td>
      </tr>
    );

    const ROWS = rows.map((rw,index)=>(
      <tr key={index}>
        <td><Input       value={rw.index}      disabled={true} /></td>
        <td><DatePicker  value={rw.date}       isDisabled={true} /></td>
        <td><InputNumber defaultValue={rw.diap_start} disabled={true} /></td>
        <td><InputNumber defaultValue={rw.diap_end}   disabled={true} /></td>
        <td>Осталось: {rw.estimate}</td>
        <td colSpan='2'><Switch value={rw.visible}/></td>
      </tr>
    )); //

    return (
        <div >
          <table>
            <tbody>
              <tr>
                <td>Индекс предприятия связи</td>
                <td>Дата</td>
                <td>Начало диапазона</td>
                <td>Конец диапазона</td>
                <td>Состояние</td>
                <td></td>
                <td></td>
              </tr>
              {EDITOR}  
              {ROWS}
            </tbody>
          </table>
        </div>
    ); //
  }
};
