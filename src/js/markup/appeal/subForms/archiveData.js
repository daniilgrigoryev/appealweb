import React from 'react'
import {Button, Card, Layout, Tag} from 'element-react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {FIshDocList} from "./ishdoc/ishDocList";

import mapping from '../mapping.js'

const headerTitle = 'Архивная информация';
const M = mapping.archive;
    
const ArchiveData = props => {
    const { handleSubmit, pristine, submitting, header,disabled } = props;
    
    return (
        <div scrollanchor='archive'>
            <Card className="box-card sectionCard" header={
                <div className="headline">
                    <h3>
                        {headerTitle}
                    </h3>
                </div>
            }>
                <form onSubmit={handleSubmit} className='pb24'>
                    <div className="form-container">
                        <h4 className="ap-h4 mb12">Сведения об архивном хранении заявления</h4>
                        <div className="wrap">
                            <div className="item">
                                <small className="label">{M.TOM.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} name={M.TOM.name} component={FInput} />
                                </div>
                            </div>
                            <div className="item">
                                <small className="label">{M.SHEETS.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} name={M.SHEETS.name} component={FInput} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    )
};

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(ArchiveData)
