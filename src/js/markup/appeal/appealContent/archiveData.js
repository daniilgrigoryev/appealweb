import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {FIshDocList} from "../subForms/ishDocList";

import mapping from './mapping.js'

const headerTitle = 'Архивная информация';
const M = mapping.archive;
    
const ArchiveData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, header,disabled } = props;
    const navi = !disabled && (nextPage||prevPage);
    
    return (
        <div scrollAnchor='archive'>
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
                                    <Tag type="gray" className='mx12'>7/8</Tag>

                                    <Button.Group>
                                        <Button type="primary" size='small' onClick={prevPage}   icon="arrow-left" />
                                        <Button type="primary" size='small' onClick={nextPage}>
                                            <i className="el-icon-arrow-right el-icon-right"/>
                                        </Button>
                                    </Button.Group>
                                </div>)
                            }
                        </div>
                    }>
                        <form onSubmit={handleSubmit}>
                            <h4 className="ap-h4 mr18">Сведения об архивном хранении заявления</h4>

                            <table>
                                <tbody>
                                    <tr>
                                        <td className='ap-input-caption'>{M.TOM.label}</td>
                                        <td><Field disabled={disabled} name={M.TOM.name} component={FInput} /></td>
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.SHEETS.label}</td>
                                        <td><Field disabled={disabled} name={M.SHEETS.name} component={FInput} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
        </div>
    )
};

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(ArchiveData)