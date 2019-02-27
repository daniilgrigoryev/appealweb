import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import {Button} from 'element-react'
import * as _ from 'lodash'

const serData = ['78-10','78-11','78-21','78-20'];

const getRow=(zajavTo)=>{
	return {
	    id: _.uniqueId('addr'),
	    zajavTo: zajavTo || ''
	}
}

const ZajavRows=(props)=>{
	const {fields,disabled,setExpanded,expandedId} = props;
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const expd = (el)=>()=>setExpanded(el.id);

    const TDS = fields.map((fld,i,arr)=>{
    	const el = arr.get(i);
    	return (<tr key={i}>
			<td><Field disabled={disabled} component={FInput} name={fld+'zajavNDoc'}  value={el.zajavNDoc}    /></td>
		    <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>     
    	</tr>);
    }); //

	return (
		<div>
			<div>
				<Button onClick={add}>Добавить адресата</Button>
			</div>
			<table style={{width: '100%'}}>
          		<tbody>{TDS}</tbody>
          	</table>		
		</div>);
} //


class OutLetterHead extends React.Component {
	
	constructor(props){
		super(props);
		this.state={
			expandedId : null
		}

		this.setExpanded = this.setExpanded.bind(this);	
	}

	setExpanded(expandedId){
		this.setState({expandedId});
	}

	render() {
		const {expandedId} = this.state; 
	    const {disabled} = this.props
	    return (
	      <div style={{background:'#ffe5f8'}}>
	        <table>
	        	<tbody>
	        		<tr>
	        			<td>№ документа</td>
	        			<td><Field disabled={disabled} component={FSelect} name='inc_ser' data={serData} /></td>
	        			<td><Field disabled={disabled} component={FInput}  name='inc_num' /></td>
	        			<td>Дата</td>
	        			<td><Field disabled={disabled} component={FPicker} name='inc_dat' datepicker='+' /></td>
	        		</tr>
	        	</tbody>
	        </table>	
	        
	        <FieldArray component={ZajavRows} name='zajavs' disabled={disabled} setExpanded={this.setExpanded} expandedId={expandedId} />

	        <table>
				<tbody>
					<tr>
	        		  <td>Подписал</td>
		              <td><Field disabled={disabled} component={FPicker} name='signer'    /></td>
		              <td>Исполнитель</td>
		              <td><Field disabled={disabled} component={FInput} name='zajavSigner' datepicker='+'  /></td>
		           	</tr>
		        </tbody>
		    </table>
	      </div>
	    )
	}//
}

export default reduxForm({
  form: 'letter_outcoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(OutLetterHead)