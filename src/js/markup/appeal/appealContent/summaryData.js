import React from 'react'
import { Field,FieldArray,reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {EApnList} from  '../subForms/apnList.js'
import {EQuestionList} from '../subForms/questionList.js'
import mapping from './mapping.js'

const header = 'Краткое содержание';
const M = mapping.SummaryData;
const tds = {'verticalAlign':'top'};

const  SummaryData = props => {
    const { nextPage,handleSubmit,prevPage, header ,disabled} = props;

    return (
      <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
            <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td style={tds}><FieldArray component={EQuestionList} name='questions' disabled={disabled} /></td>
                  <td style={tds}><FieldArray component={EApnList}      name='apn_list' disabled={disabled} /></td>
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
      </div>
    )
} //

export default reduxForm({
  form: 'appeal', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(SummaryData)