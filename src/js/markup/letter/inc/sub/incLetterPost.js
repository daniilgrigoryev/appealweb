import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'


const getRow = (apn,date)=>{
  return {
    id: _.uniqueId('qlr'),
    apn: apn || null,
    date: date || null
  }
}

const postRows = (props)=>{
    const {fields,disabled} = props;
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind);
    const ROWS = fields.map((x,i)=>(<tr key={i} >
            <td><Field disabled={disabled} component={FInput}  name={x+'apn'}  value={x.apn}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+'date'} value={x.date} date='+' /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Дата</th>
            <th colSpan='2'>
              {disabled ? null : <button type="button" onClick={add} title='Добавить № постановления'>+</button>}
            </th>
          </tr>
        </thead>
        <tbody>{ROWS}</tbody>
      </table>
    );
}//

const  IncLetterPost = props => {
    const {disabled} = props;
    return (
    	<div style={{background:'#ddeaff'}}>
    		<div>
    			<h2>Постановления</h2>
    		</div>
    		<FieldArray component={postRows} name='posts' disabled={disabled} />
    	</div>);
} //

export default reduxForm({
  form: 'letter_incoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IncLetterPost)