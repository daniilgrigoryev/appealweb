import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {EApnList} from '../subForms/apnList.js'
import {EQuestionList} from '../subForms/questionList.js'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from './mapping.js'
import {EOrganizationFrom} from "../subForms/organizationFrom";
import {EOrganizationControl} from "../subForms/organizationControl";

const headerTitle = 'Краткое содержание';

const M = mapping.SummaryData;

const SummaryData = props => {
    const {nextPage, handleSubmit, prevPage, header, disabled} = props;

    return (
        <div>
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                {/*<Layout.Col span="16" offset="4">*/}
                    <Card className="box-card" header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main py12'>
                            <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                {headerTitle}
                            </h3>

                            {disabled
                                ? null
                                : (<div>
                                    <Tag type="gray" className='mx12'>4/8</Tag>

                                    <Button.Group>
                                        <Button type="primary" size='small' icon="arrow-left"
                                                onClick={prevPage}/>
                                        <Button type="primary" size='small' onClick={nextPage}>
                                            <i className="el-icon-arrow-right el-icon-right"/>
                                        </Button>
                                    </Button.Group>
                                </div>)
                            }
                        </div>
                    }>
                        <form onSubmit={handleSubmit}>
                            <h4 className='ap-h4'>Тематика обращения</h4>
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