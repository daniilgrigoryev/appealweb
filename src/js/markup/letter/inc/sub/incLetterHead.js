import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'


const serData = ['78-10','78-11','78-21','78-20'];

const getRow=(zajavSender,zajavNDoc,zajavDate,zajavSigner)=>{
	return {
	    id: _.uniqueId('addr'),
	    zajavSender: zajavSender || '',
	    zajavNDoc: zajavNDoc || '',
	    zajavDate: zajavDate || null,
	    zajavSigner: zajavSigner | ''
	}
}

const tdCollapsed = (fld,el,i,disabled,rmv,expd)=>{
	return (
		<tr key={i} onClick={expd(el)}>
			<td>{el.zajavSender}</td>
			<td>{el.zajavDate}</td>
			<td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>     
	    </tr>);
} //

const tdExpanded = (fld,el,i,disabled,rmv,expd)=>{
	return (
		<tr key={i}>
			<td>
		    	<table>
		          <tbody>
		          	<tr>
		              <td>От кого</td>
		              <td colSpan='6'><Field disabled={disabled} component={FInput} name={fld+'zajavSender'}  value={el.zajavSender}  /></td>
		            </tr>
		            <tr>
		              <td>№ документа</td>
		              <td><Field disabled={disabled} component={FInput} name={fld+'zajavNDoc'}  value={el.zajavNDoc}    /></td>
		           
		              <td>Дата</td>
		              <td><Field disabled={disabled} component={FPicker} name={fld+'zajavDate'}  value={el.zajavDate}  datepicker='+'   /></td>
		              <td>Подписал</td>
		              <td><Field disabled={disabled} component={FInput} name={fld+'zajavSigner'}  value={el.zajavSigner} /></td>
		           	</tr>
		           </tbody>
		        </table>
	        </td>
	        <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>     
    </tr>);
}; //

const ZajavRows=(props)=>{
	const {fields,disabled,setExpanded,expandedId} = props;
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const expd = (el)=>()=>setExpanded(el.id);

    const TDS = fields.map((fld,i,arr)=>{
    	const el = arr.get(i);
    	return (el.id==expandedId? tdExpanded : tdCollapsed)(fld,el,i,disabled,rmv,expd);
    }); //

	return (
		<div>
			<table>
				<tbody>
					<tr>
						<td><h2>Наименование организации/заявитель</h2></td>
						<td><button onClick={add}>+</button></td>
					</tr>
				</tbody>
			</table>
		   	<table style={{width: '100%'}}>
          		<tbody>{TDS}</tbody>
          	</table>		
		</div>);
} //


class IncLetterHead extends React.Component {
	
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
	        			<td>Входящий №</td>
	        			<td><Field disabled={disabled} component={FSelect} name='inc_ser' data={serData} /></td>
	        			<td><Field disabled={disabled} component={FInput}  name='inc_num' /></td>
	        			<td>Дата</td>
	        			<td><Field disabled={disabled} component={FPicker} name='inc_dat' datepicker='+' /></td>
	        		</tr>
	        	</tbody>
	        </table>	
	        
	        <FieldArray component={ZajavRows} name='zajavs' disabled={disabled} setExpanded={this.setExpanded} expandedId={expandedId} />
	      </div>
	    )
	}//
}

export default reduxForm({
  form: 'letter_incoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IncLetterHead)