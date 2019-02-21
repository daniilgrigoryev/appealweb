import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ERadio,FRadio,getOptions} from '../element2rform/radio.js'
import mapping from './mapping.js'

const header = 'Сведения о заявителе';
const sexOptions = getOptions('M','мужской','F','женский');
const zajavOptions = getOptions(  'FL','Физическое лицо','UL','Юридическое лицо');
const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const M = mapping.claimantData;

class ClaimantData extends React.Component {
  
  render(){
    const { handleSubmit, nextPage, prevPage, pristine, submitting,header, content ,disabled} = this.props;
    
    const isPred = !!content[M.PRED.name]; 
    const isFL = content[M.ZAJAV_LIC.name] != 'UL';

    const ZAJAV_SOURCE = isFL
    ? ([
      <tr key='flFam'>
        <td>{M.FAM.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.FAM.name} component={FInput} /></td>
      </tr>,
      <tr key='flName'>
        <td>{M.NAME.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.NAME.name} component={FInput} /></td>
      </tr>,
      <tr key='flSurname'>
        <td>{M.SURNAME.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.SURNAME.name} component={FInput} /></td>
      </tr>,
      <tr key='flSex'>
        <td>{M.SEX.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.SEX.name} component={FRadio} options={sexOptions} /></td>
      </tr>
      ])

    :([
      <tr key='ulOrgName'>
        <td>{M.ORG_NAME.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.ORG_NAME.name} component={FInput} /></td>
      </tr>,
      <tr key='ulINN'>
        <td>{M.INN.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.INN.name} component={FInput} /></td>
      </tr>,
      <tr key='ulKPP'>
        <td>{M.KPP.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.KPP.name} component={FInput} /></td>
      </tr>,
      <tr key='ulIshNum'>
        <td>{M.ISH_NUMBER.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.ISH_NUMBER.name} component={FInput} /></td>
      </tr>,
      <tr key='ulIshDt'>
        <td>{M.ISH_DATE.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.ISH_DATE.name} component={FPicker} datepicker='+' /></td>
      </tr>,
      <tr key='ulPodpis'>
        <td>{M.PODPIS.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.PODPIS.name} component={FInput} /></td>
      </tr>
      ]);


    const KVART = isFL 
      ? ([
          <td key='kvFl1'>{M.KVART.label}</td>,
          <td key='kvFl2'><Field disabled={disabled} name={M.KVART.name} component={FInput} /></td>
        ])
      : ([
          <td key='kvUl1'>{M.OFFICE.label}</td>,
          <td key='kvUl2'><Field disabled={disabled} name={M.OFFICE.name} component={FInput} /></td>
        ]);
//

    const PREDST = isPred ? [
       <tr key='flPredFam'>
        <td>{M.PRED_FAM.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.PRED_FAM.name} component={FInput} /></td>
      </tr>,
      <tr key='flPredName'>
        <td>{M.PRED_NAME.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.PRED_NAME.name} component={FInput} /></td>
      </tr>,
      <tr key='flPredSurname'>
        <td>{M.PRED_SURNAME.label}</td>
        <td colSpan='3'><Field disabled={disabled} name={M.PRED_SURNAME.name} component={FInput} /></td>
      </tr>]
    : null ;

    return ( <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>
            
            <table>
              <tbody>
                <tr key='flSurname'>
                  <td colSpan='2'><Field disabled={disabled} name={M.ZAJAV_LIC.name} component={FRadio} options={zajavOptions} /></td>
                </tr>
                {ZAJAV_SOURCE}

                <tr key='flPred'>
                  <td>{M.PRED.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.PRED.name} component={FCheckbox} /></td>
                </tr>
                {PREDST}

                <tr>
                  <td>{M.PHONE.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.PHONE.name} component={FInput} mask={phoneMask} /></td>
                </tr>
                <tr>
                  <td>{M.EMAIL.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.EMAIL.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.REGION.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.REGION.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.RAYON.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.RAYON.name} component={FInput} /></td>
                </tr>

                <tr>
                  <td>{M.NPUNKT.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.NPUNKT.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.STREET.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.STREET.name} component={FInput} /></td>
                </tr>

                <tr>
                  <td>{M.DOM.label}</td>
                  <td><Field disabled={disabled} name={M.DOM.name} component={FInput} /></td>
                  <td>{M.KORPUS.label}</td>
                  <td><Field disabled={disabled} name={M.KORPUS.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.STR.label}</td>
                  <td><Field disabled={disabled} name={M.STR.name} component={FInput} /></td>
                  {KVART}
                </tr>
                <tr>
                  <td>{M.PINDEX.label}</td>
                  <td colSpan='3'><Field disabled={disabled} name={M.PINDEX.name} component={FInput} /></td>
                </tr>
              </tbody>
            </table>

            <div>
              {disabled 
              ? null 
              : (<div>
                  <button type="button" onClick={prevPage}>Previous</button>
                  <button type="submit" onClick={nextPage}>Submit</button>
                </div>)
            }
            </div>
          </form>
        </div>
      </div>);
  } //  
}//


const mapStateToProps = (state)=>{
  const V = state.getIn(['form','appeal','values']);
  return { content: V ? V.toJS() : {}};
}
 
export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true // <------ unregister fields on unmount
  //validate
  })
)(ClaimantData)