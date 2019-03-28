import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {EOrganizationFrom, FOrganizationFrom} from '../subForms/organizationFrom.js'
import {EOrganizationControl, FOrganizationControl} from '../subForms/organizationControl.js'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from './mapping.js'

const headerTitle = 'Организации';
const M = mapping.organizationsData;

const OrganizationsData = props => {
    const {handleSubmit, pristine, nextPage, prevPage, submitting, header, system, disabled} = props
    const isMadi = system == 'M';
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
                                    <Tag type="gray" className='mx12'>3/8</Tag>

                                    <Button.Group>
                                        <Button type="primary" size='small' icon="arrow-left" onClick={prevPage.bind(isMadi)}/>
                                        <Button type="primary" size='small' onClick={nextPage.bind(isMadi)}>
                                            <i className="el-icon-arrow-right el-icon-right"/>
                                        </Button>
                                    </Button.Group>
                                </div>)
                            }
                        </div>
                    }>
                        <form onSubmit={handleSubmit}>
                            <h4 className='ap-h4'>{M.SENT_FROM.label}</h4>
                            <FieldArray name='organizations_from' component={EOrganizationFrom} disabled={disabled}/>

                            <hr className='txt-hr my18'/>

                            <h4 className='ap-h4'>{M.UNDER_CONTROL.label}</h4>
                            <FieldArray name='organizations_control' component={EOrganizationControl} disabled={disabled}/>
                        </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
        </div>
    )
}; //

const mapStateToProps = (state) => ({system: state.getIn(['general', 'system'])});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(OrganizationsData)