import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button, Card, Layout} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishBasic;

class IshBasic extends React.Component {

    render() {
        const {disabled} = this.props
        return (

            <div className="form-container my24">
                <h4 className='ap-h4'>Основные сведения:</h4>

                <div className="wrap my12">
                    <div className="item item--left">
                        <small className="label">{M.VID_DOC.label}</small>
                        <div className="value">
                            <Field disabled={disabled} component={FSelect} name={M.VID_DOC.name} dataKey={M.VID_DOC.key}/>
                        </div>
                    </div>

                    <div className="item item--right">
                        <small className="label">{M.NOTES.label}</small>
                        <div className="value">
                            <Field disabled={disabled} component={FInput} name={M.NOTES.name} textarea='+'/>
                        </div>
                    </div>
                    <div className="item" style={{'gridColumn': 'auto / span 2'}}>
                        <small className="label">{M.SUMMARY.label}</small>
                        <div className="value">
                            <Field disabled={disabled} component={FInput} name={M.SUMMARY.name}/>
                        </div>
                    </div>
                    <div className="item"  style={{'gridColumn': 'auto / span 1', 'grid-template-columns': 'minmax(190px, max-content) max-content'}}>
                        <small className="label">{M.DELIV_TYPE.label}</small>
                        <div className="value">
                            <Field disabled={disabled} component={FSelect} name={M.DELIV_TYPE.name} dataKey={M.DELIV_TYPE.key}/>
                        </div>
                    </div>
                    <div className="item item--flow"  style={{'gridColumn': 'auto / span 1'}}>
                        <small className="label">{M.SHEETS_COUNT.label}</small>
                        <div className="value">
                            <Field disabled={disabled} component={FInput} name={M.SHEETS_COUNT.name}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }//
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshBasic)