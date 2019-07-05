import React from 'react'
import {Button, Card, Layout, Tag} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {EApnList} from './apnList.js'
import {EQuestionList} from './questionList.js'
import {EOrganizationFrom} from "./organizationFrom";
import {EOrganizationControl} from "./organizationControl";

import mapping from '../mapping.js'

const headerTitle = 'Краткое содержание';

const M = mapping.SummaryData;

const SummaryData = props => {
    const {handleSubmit,disabled} = props;
    
    return (
        <div scrollanchor='summary'>
                <Card className="box-card sectionCard" header={
                    <div className='headline'>
                        <h3>{headerTitle}</h3>
                    </div>
                }>
                      <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            <h4 className='ap-h4'>Тематики</h4>
                            <FieldArray component={EQuestionList} name='questions' disabled={disabled}/>
                            
                            <h4 className='ap-h4'>Постановления</h4>
                            <FieldArray component={EApnList} name='apn_list' disabled={disabled}/>
                        </form>
                      </div>
                </Card>
        </div>
    )
} //

export default reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(SummaryData)
