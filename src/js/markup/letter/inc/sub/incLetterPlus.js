import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'
import mapping from '../mapping.js' 

const M = mapping.incLetterPlus;

class IncLetterPlus extends React.Component {
	
	render() {  
	    const {disabled} = this.props
	    return (
	      <div style={{background:'#fce9c2'}}>
	      	<h2>{M.DOP_INF.label}</h2>
	        <table>
	          <tbody>
	            <tr>
	              <td>{M.PROT_N.label}</td>
	              <td><Field disabled={disabled} component={FInput} name={M.PROT_N.name} /></td>
	              <td>{M.PROT_DATE.label}</td>
	              <td><Field disabled={disabled} component={FPicker} name={M.PROT_DATE.name} datepicker='+' /></td>
	            </tr>
	            <tr>
	              <td>{M.VIOLATOR.label}</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.VIOLATOR.name}   /></td>
	            </tr>
	            <tr>
	              <td>{M.COURT.label}</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.COURT.name} /></td>
	            </tr>
	            <tr>
	            	<td>{M.DEC_REG_COURT.label}</td>
	            	<td><Field disabled={disabled} component={FSelect} name={M.DEC_REG_COURT.name} dataKey={M.DEC_REG_COURT.key}    /></td>
	            	<td>{M.DEC_DATE.label}</td>
	            	<td><Field disabled={disabled} component={FPicker} name={M.DEC_DATE.name} datepicker='+' /></td>
	            </tr>
	            <tr>
	            	<td>{M.DEC_MSC_COURT.label}</td>
	            	<td><Field disabled={disabled} component={FSelect} name={M.DEC_MSC_COURT.name} dataKey={M.DEC_MSC_COURT.key}    /></td>
	            	<td>{M.EFFECT_DATE.label}</td>
	            	<td><Field disabled={disabled} component={FPicker} name={M.EFFECT_DATE.name} datepicker='+' /></td>
	            </tr>
	            <tr>
	              <td>{M.NOTE.label}</td>
	              <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.NOTE.name} type='textarea' /></td>
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