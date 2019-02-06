import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {EOrganizationFrom,FOrganizationFrom} from '../subForms/organizationFrom.js'
import {EOrganizationControl,FOrganizationControl} from '../subForms/organizationControl.js'
import mapping from './mapping.js'

const OrganizationsData = props => {
    const { handleSubmit, pristine, previousPage, submitting, header } = props
    const M = mapping.organizationsData;

    return (
      <div className='appealSection'>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>
            <h2>Направлено из организации</h2>            
            <Field name='organizationsFrom' component={FOrganizationFrom} />                

            <h2>На контроле в организации</h2>            
            <Field name='organizationsControl' component={FOrganizationControl} />    

            <div>
              <button type="button" className="previous" onClick={previousPage}>Previous</button>
              <button type="submit" >Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
} //

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(OrganizationsData)