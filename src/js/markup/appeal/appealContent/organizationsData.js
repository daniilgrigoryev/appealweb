import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {EOrganizationFrom,FOrganizationFrom} from '../subForms/organizationFrom.js'
import {EOrganizationControl,FOrganizationControl} from '../subForms/organizationControl.js'
import mapping from './mapping.js'

const header = 'Организации';
const M = mapping.organizationsData;

const OrganizationsData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, header, system,disabled } = props
    const isMadi = system =='M';

    return (
      <div className='appealSection'>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>
            <h2>{M.SENT_FROM.label}</h2>            
            <FieldArray name='organizationsFrom' component={EOrganizationFrom} disabled={disabled} />                

            <h2>{M.UNDER_CONTROL.label}</h2>            
            <FieldArray name='organizationsControl' component={EOrganizationControl} disabled={disabled} />    

            <div>
            {disabled 
              ? null 
              : (<div>
                  <button type="button" onClick={prevPage.bind(isMadi)}>Previous</button>
                  <button type="submit" onClick={nextPage.bind(isMadi)}>Submit</button>
                </div>)
            }
            </div>
          </form>
        </div>
      </div>
    )
} //

const mapStateToProps = (state)=>({ system: state.getIn(['general','system']) });

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true // <------ unregister fields on unmount
  //validate
  })
)(OrganizationsData)