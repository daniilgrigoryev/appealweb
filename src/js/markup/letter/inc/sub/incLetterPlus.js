import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'

class IncLetterPlus extends React.Component {
	
	render() {  
	    const {disabled} = this.props
	    return (
	      <div style={{background:'#fce9c2'}}>
	      	<h2>Дополнительные сведения</h2>
	        <table>
	          <tbody>
	            <tr>
	              <td>Номер протокола</td>
	              <td><Field disabled={disabled} component={FInput} name='protN' /></td>
	              <td>Дата</td>
	              <td><Field disabled={disabled} component={FPicker} name='protDate' datepicker='+' /></td>
	            </tr>
	            <tr>
	              <td>ФИО/Наименование нарушителя</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name='violator'   /></td>
	            </tr>
	            <tr>
	              <td>Наименование суда</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name='court' /></td>
	            </tr>
	            <tr>
	            	<td>Решение районного суда</td>
	            	<td><Field disabled={disabled} component={FSelect} name='decisionRegionalCourt' dataKey='decision_regional_court'    /></td>
	            	<td>Дата решения</td>
	            	<td><Field disabled={disabled} component={FPicker} name='decisionDate' datepicker='+' /></td>
	            </tr>
	            <tr>
	            	<td>Обжалование в Мосгорсуд</td>
	            	<td><Field disabled={disabled} component={FSelect} name='decisionMoscowCourt' dataKey='decision_moscow_court'    /></td>
	            	<td>Вступление в законную силу</td>
	            	<td><Field disabled={disabled} component={FPicker} name='effectDate' datepicker='+' /></td>
	            </tr>
	            <tr>
	              <td>Комментарий</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name='note' type='textarea' /></td>
	            </tr>
	          </tbody>
	        </table>
	      </div>
	    )
  	}//
}

export default reduxForm({
  form: 'letter_incoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IncLetterPlus)