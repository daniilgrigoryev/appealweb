import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishLinksScan;

const getRow = (npost, desc, docId, content) => {
    return {
        id: _.uniqueId('ldocs'),
        desc: desc || '',
        docId: docId || null,
        content: content || null
    }
};

const scannedDocs = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td>
              <span className='ap-table-list-number mr12'>
                 {i + 1}
             </span>
            </td>
            <td>
                <Field component={FInput} name={x + M.ID.name} value={x[M.ID.name]}
                       disabled={true}/>
            </td>
            <td>
                <Field component={FInput} name={x + M.DESC.name} value={x[M.DESC.name]}
                       disabled={true}/>
            </td>
            <td>
                {disabled ? null :
                    <Button type="text" onClick={inf(i)}>
                        <i className="el-icon-information color-blue"/>
                    </Button>
                }

                {disabled ? null :
                    <Button type="text" onClick={rmv(i)}>
                        <i className="el-icon-delete color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>));

    return (
        <React.Fragment>
            {!fields.length ?
                <p className='mt-neg12 mb18 txt-em txt-s color-gray-light'>Нет сканированных документов</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='wmin360'>
                                <thead>
                                <tr>
                                    <td className='ap-table-header'>№</td>
                                    <td className='ap-table-header'>{M.ID.label}</td>
                                    <td className='ap-table-header'>{M.DESC.label}</td>
                                    <td></td>
                                </tr>
                                </thead>
                                <tbody>
                                {ROWS}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            }

            <table>
                <tbody>
                <tr>
                    <td className='ap-input-caption'></td>
                    <td>
                        <table>
                            <tbody>
                            <tr>
                                <td className='flex-parent flex-parent--center-cross'>
                                    {disabled ? null :
                                        <Button size="small" icon="upload2" onClick={add}
                                                className="flex-parent mb18 mr12"
                                                title='Добавить постановление'>Загрузить</Button>
                                    }

                                    {disabled ? null :
                                        <Button size="small" icon="picture" onClick={add}
                                                className="flex-parent mb18"
                                                title='Добавить постановление'>Сканировать</Button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </React.Fragment>);
};

class IshLinkScan extends React.Component {
    render() {
        const {disabled} = this.props;
        return (
            <div>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>{M.SCAN_DOC.label}</h4>

                <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} disabled={disabled}/>
            </div>
        )
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshLinkScan)