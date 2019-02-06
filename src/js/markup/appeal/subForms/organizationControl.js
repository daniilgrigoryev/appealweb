import React from 'react'
import {EInput} from '../element2rform/finput.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'

const OFRow = (props)=>{
  const {id,onChange,onRemove} = props;
  const onRmv = ()=>onRemove(id);
  const onChg = (field)=>(newVal)=>onChange(id,field,newVal);

  return (<tr key={id} >
            <td><EInput name='name' value={props.name} onChange={onChg('name')} validate={[V.org.validateOrgCtrl('name')]} validate_args={props} /></td>
            <td><EInput name='num'  value={props.num}  onChange={onChg('num')} validate={[V.org.validateOrgCtrl('num')]} validate_args={props} /></td>
            <td><EPicker name='date' value={props.date} onChange={onChg('date')} validate={[V.org.validateOrgCtrl('date')]} validate_args={props} datepicker='+' /></td>
            <td><EPicker name='control_date' value={props.control_date} validate={[V.org.validateOrgCtrl('control_date')]} validate_args={props} onChange={onChg('control_date')} datepicker='+' /></td>
            <td><button onClick={onRmv}>x</button></td>
          </tr>);
} //


const getRow = (name,num,date,control_date)=>{
  return {
    id: _.uniqueId('orc'),
    name: name || '',
    num:  num  || '',
    date: date || null,
    control_date: control_date || null
  }
}

// Element component
class EOrganizationControl extends React.Component {

  constructor(props) {
    super(props);
    let {rows} = this.props;
    if (!rows || !rows.length){
      rows = [getRow()];
    }
    this.state = { rows };
  }

  onChange(id,field,newVal) {
    const P = this.props;
    const {reduxformfield,input} = P;
    const onChange = reduxformfield ? P.input.onChange : P.onChange;
    this.state.rows.filter(x=>x.id==id)[0][field] = newVal;
    const rows = this.state.rows;
    this.setState({rows},()=>{
      if (onChange){
        onChange(rows);
      }
    });
  }

  onRemove(rowId){
    const P = this.props;
    const {reduxformfield,input} = P;
    const onChange = reduxformfield ? P.input.onChange : P.onChange;
    const rows = this.state.rows.filter(x=>x.id!=rowId);
    this.setState({rows},()=>{
      if (onChange){
        onChange(rows);
      }
    }); 
  }

  render() {
    const chg  = this.onChange.bind(this);
    const rmv  = this.onRemove.bind(this);
    const ROWS = this.state.rows.map(x=>(<OFRow key={x.id} {...x} onChange={chg} onRemove={rmv}>{x.value}</OFRow>)); //
    const add = ()=>{
      const {rows} = this.state;
      rows.push(getRow());
      this.setState({rows})
    };

    return (
      <table>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Исх. номер</th>
            <th>Исх. дата</th>
            <th>Дата контроля</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ROWS}
          <tr>
            <td><button type="button" onClick={add}>Добавить организацию</button></td>
          </tr>
        </tbody>
      </table>
    )
  }//
}

const FOrganizationControl = (props) => {
  const {input,meta} = props;
  return <EOrganizationControl {...props} {...input} {...meta} reduxformfield="true" />
}  //
//


export {EOrganizationControl,FOrganizationControl};