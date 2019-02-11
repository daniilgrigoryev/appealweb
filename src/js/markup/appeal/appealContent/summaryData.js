import React from 'react'
import { Field,FieldArray,reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {EApnList} from  '../subForms/apnList.js'
import {EQuestionList} from '../subForms/questionList.js'
import mapping from './mapping.js'

const M = mapping.SummaryData;
const tds = {'verticalAlign':'top'};

const  SummaryData = props => {
    const { nextPage,handleSubmit,prevPage, header } = props;

    return (
      <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
            <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td style={tds}><FieldArray component={EQuestionList} name='questions' /></td>
                  <td style={tds}><FieldArray component={EApnList}      name='apn_list' /></td>
                </tr>
              </tbody>
            </table>

            <div>
              <button type="button" onClick={prevPage}>Previous</button>
              <button type="submit" onClick={nextPage}>Submit</button>
            </div>
            </form>
        </div>
      </div>
    )
} //

export default reduxForm({
  form: 'appeal', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(SummaryData)