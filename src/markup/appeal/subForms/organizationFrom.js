import React from 'react'
import {EInput} from '../element2rform/finput.js'
import * as _ from 'lodash'

const OFRow = (props,onRef)=>{
  const onRemove = ()=>{
    debugger;
  }
  const onChange = ()=>{
    debugger;
  }

  return (<tr key={props.key} ref={(x)=>onRef(x);} >
            <td><EInput name='name' value={props.name} onChange={onChange} /></td>
            <td><EInput name='num'  value={props.num}  onChange={onChange} /></td>
            <td><EInput name='date' value={props.date} onChange={onChange} /></td>
            <td><button onClick={onRemove}>x</button></td>
          </tr>);
} //


const getRow = (name,num,date)=>{
  return {
    id: _.uniqueId('ofr'),
    name: name || '',
    num:  num  || ''
    date: date || null
  }
}

// Element component
class EOrganizationFrom extends React.Component {

  constructor(props) {
    super(props);
    let {rows} = this.props;
    if (!rows || !rows.length){
      rows = [getRow()];
    }
    this.state = { rows };
  }

  onChange(value) {
    const onChange = this.props.onChange;
    debugger;

    this.setState({value},()=>{
      if (onChange){
        onChange(value);
      }
    });
  }

  render() {
    const chg  = this.onChange.bind(this);
    const ROWS = this.state.rows.map(x=><OFRow key={x.id} {...x} onChange={chg} onRemove={rmv}>{x.value}</OrganizationFrom>); //
    const add = ()=>{};
    const rmv = ()=>{};
    
    return (
      <table>
        <tbody>
          {ROWS}
          <tr>
            <td><button>Добавить организацию</button></td>
          </tr>
        </tbody>
      </table>
    )
  }//
}

const FOrganizationFrom = (props) => {
  const {input,meta} = props;
  return <EOrganizationFrom {...props} {...input} {...meta} reduxformfield="true" />
}  //
//


export {EOrganizationFrom,FOrganizationFrom};