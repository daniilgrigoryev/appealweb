import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {EIshDocList, FIshDocList} from '../subForms/ishDocList.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {FTopicList} from "../subForms/topicList";

import mapping from './mapping.js'

const headerTitle = 'Исходящие документы';

const IshDocsData = props => {
    const {handleSubmit, pristine, nextPage, prevPage, submitting, disabled, categories,claim_id} = props;
    const navi = !disabled && (nextPage||prevPage);
    
    return (
        <div>
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                {/*<Layout.Col span="16" offset="4">*/}
                    <Card className="box-card" header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                {headerTitle}
                            </h3>

                            {!navi
                                ? null
                                : (<div>
                                    <Tag type="gray" className='mx12'>6/8</Tag>

                                    <Button.Group>
                                        <Button type="primary" size='small' onClick={prevPage} icon="arrow-left" />
                                        <Button type="primary" size='small' onClick={nextPage}>
                                            <i className="el-icon-arrow-right el-icon-right"/>
                                        </Button>
                                    </Button.Group>
                                </div>)
                            }
                        </div>
                    }>
                        <form onSubmit={handleSubmit}>
                            <h4 className='ap-h4'>Список исходящих документов</h4>
                            <FieldArray name='ish_docs_data' component={FIshDocList} disabled={disabled} categories={categories} claim_id={claim_id}/>
                        </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
        </div>
    )
} //

const mapStateToProps = (state,props)=>{
    const claim_id = state.getIn(['form','appeal','values','id']);
    return {claim_id};
}

export default compose(
    connect(mapStateToProps/*,mapDispatchToProps*/),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(IshDocsData)