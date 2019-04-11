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
            <React.Fragment>
                <hr className='txt-hr my6'/>
                <h4 className='ap-h4'>Основные сведения:</h4>

                <Layout.Row gutter="0">
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='mb18 w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption wmin180'>{M.VID_DOC.label}</td>
                                <td colSpan='3'><Field disabled={disabled} component={FSelect} name={M.VID_DOC.name}
                                                       dataKey={M.VID_DOC.key}/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption wmin180'>{M.SUMMARY.label}</td>
                                <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.SUMMARY.name}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Layout.Col>
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='mb18 w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption wmin180'>{M.NOTES.label}</td>
                                <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.NOTES.name}
                                                       textarea='+'/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption wmin180'>{M.DELIV_TYPE.label}</td>
                                <td className='wmin120'><Field disabled={disabled} component={FSelect} name={M.DELIV_TYPE.name}
                                                               dataKey={M.DELIV_TYPE.key}/></td>
                                <td className='ap-input-caption w120'>{M.SHEETS_COUNT.label}</td>
                                <td className='w120'><Field disabled={disabled} component={FInput} name={M.SHEETS_COUNT.name}/></td>
                            </tr>
                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>
            </React.Fragment>
        )
    }//
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshBasic)