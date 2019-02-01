import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ERadio,FRadio,getOptions} from '../element2rform/radio.js'
import mapping from './mapping.js'

const sexOptions = getOptions('M','мужской','F','женский');
const zajavOptions = getOptions(  'FL','Физическое лицо','UL','Юридическое лицо');
const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const M = mapping.claimantData;

class ClaimantData extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      isFL: true
    }
  }
  
  render(){
    const { handleSubmit, nextPage, prevPage, pristine, submitting,header } = this.props;
    const toggleZajav = (newVal)=>this.setState({isFL:newVal=='FL'})

    const ZAJAV_SOURCE = this.state.isFL
    ? ([
      <tr key='flFam'>
        <td>{M.FAM.label}</td>
        <td colspan='3'><Field name={M.FAM.name} component={FInput} /></td>
      </tr>,
      <tr key='flName'>
        <td>{M.NAME.label}</td>
        <td colspan='3'><Field name={M.NAME.name} component={FInput} /></td>
      </tr>,
      <tr key='flSurname'>
        <td>{M.SURNAME.label}</td>
        <td colspan='3'><Field name={M.SURNAME.name} component={FInput} /></td>
      </tr>,
      <tr key='flSex'>
        <td>{M.SEX.label}</td>
        <td colspan='3'><Field name={M.SEX.name} component={FRadio} options={sexOptions} /></td>
      </tr>,
      <tr key='flPred'>
        <td>{M.PRED.label}</td>
        <td colspan='3'><Field name={M.PRED.name} component={FCheckbox} /></td>
      </tr>
      ])

    :([
      <tr key='ulOrgName'>
        <td>{M.ORG_NAME.label}</td>
        <td colspan='3'><Field name={M.ORG_NAME.name} component={FInput} /></td>
      </tr>,
      <tr key='ulINN'>
        <td>{M.INN.label}</td>
        <td colspan='3'><Field name={M.INN.name} component={FInput} /></td>
      </tr>,
      <tr key='ulKPP'>
        <td>{M.KPP.label}</td>
        <td colspan='3'><Field name={M.KPP.name} component={FInput} /></td>
      </tr>,
      <tr key='ulIshNum'>
        <td>{M.ISH_NUMBER.label}</td>
        <td colspan='3'><Field name={M.ISH_NUMBER.name} component={FInput} /></td>
      </tr>,
      <tr key='ulIshDt'>
        <td>{M.ISH_DATE.label}</td>
        <td colspan='3'><Field name={M.ISH_DATE.name} component={FPicker} datepicker='+' /></td>
      </tr>,
      <tr key='ulPodpis'>
        <td>{M.PODPIS.label}</td>
        <td colspan='3'><Field name={M.PODPIS.name} component={FInput} /></td>
      </tr>
      ]);


    const KVART =this.state.isFL 
      ? ([
          <td key='kvFl1'>{M.KVART.label}</td>,
          <td key='kvFl2'><Field name={M.KVART.name} component={FInput} /></td>
        ])
      : ([
          <td key='kvUl1'>{M.OFFICE.label}</td>,
          <td key='kvUl2'><Field name={M.OFFICE.name} component={FInput} /></td>
        ]);
//
    return ( <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>
            
            <table>
              <tbody>
                <tr key='flSurname'>
                  <td colspan='2'><ERadio options={zajavOptions} onChange={toggleZajav} /></td>
                </tr>
                {ZAJAV_SOURCE}

                <tr>
                  <td>{M.PHONE.label}</td>
                  <td colspan='3'><Field name={M.PHONE.name} component={FInput} mask={phoneMask} /></td>
                </tr>
                <tr>
                  <td>{M.EMAIL.label}</td>
                  <td colspan='3'><Field name={M.EMAIL.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.REGION.label}</td>
                  <td colspan='3'><Field name={M.REGION.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.RAYON.label}</td>
                  <td colspan='3'><Field name={M.RAYON.name} component={FInput} /></td>
                </tr>

                <tr>
                  <td>{M.NPUNKT.label}</td>
                  <td colspan='3'><Field name={M.NPUNKT.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.STREET.label}</td>
                  <td colspan='3'><Field name={M.STREET.name} component={FInput} /></td>
                </tr>

                <tr>
                  <td>{M.DOM.label}</td>
                  <td><Field name={M.DOM.name} component={FInput} /></td>
                  <td>{M.KORPUS.label}</td>
                  <td><Field name={M.KORPUS.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.STR.label}</td>
                  <td><Field name={M.STR.name} component={FInput} /></td>
                  {KVART}
                </tr>
                <tr>
                  <td>{M.PINDEX.label}</td>
                  <td colspan='3'><Field name={M.PINDEX.name} component={FInput} /></td>
                </tr>
              </tbody>
            </table>

            <div>
              <button type="button" className="previous" onClick={prevPage}>Previous</button>
              <button type="submit" >Submit</button>
            </div>
          </form>
        </div>
      </div>);
  } //  
}


export default reduxForm({
  form: 'appeal', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(ClaimantData)