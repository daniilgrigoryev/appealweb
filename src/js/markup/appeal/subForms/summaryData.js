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
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card border-b--0" header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h3 className='ap-h3 flex-parent flex-parent--center-cross'>{headerTitle}</h3>
                        </div>
                    } bodyStyle={{'paddingBottom': 0}}>
                        <form onSubmit={handleSubmit}>
                            <FieldArray component={EQuestionList} name='questions' disabled={disabled}/>

                            <hr className='txt-hr my18'/>

                            <h4 className='ap-h4'>Постановления</h4>
                            <FieldArray component={EApnList} name='apn_list' disabled={disabled}/>
                        </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
        </div>
    )
} //

export default reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(SummaryData)
