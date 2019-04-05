import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../../components/finput.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.incLetterHead;

const serData = ['78-10', '78-11', '78-21', '78-20'];

const getRow = (id,zajavSender, zajavNDoc, zajavDate, zajavSigner) => {
    return {
        id: id || null,
        zajavSender: zajavSender || '',
        zajavNDoc: zajavNDoc || '',
        zajavDate: zajavDate || null,
        zajavSigner: zajavSigner | ''
    }
}

const tdCollapsed = (fld, el, i, disabled, rmv, expd) => {
    return (
        <React.Fragment>
            <tr key={i}>
                <td>
                    <span className="ap-table-list-number mr12">{i + 1}</span>
                </td>
                <td className='ap-table__header'>{el.zajavSender}</td>
                <td className='ap-table__header'>{el.zajavDate}</td>
                <td></td>
                <td></td>
                <td className='pr12 align-r'>
                    <Button type="text" onClick={expd(el)}>
                        <i className="el-icon-edit color-green"/>
                    </Button>

                    <Button type="text" onClick={rmv(i)}>
                        <i className="el-icon-delete color-red-dark"/>
                    </Button>
                </td>
            </tr>
            <tr>
                <td colSpan='6'>
                    <hr className='txt-hr my18'/>
                </td>
            </tr>
        </React.Fragment>
    );
};

const tdExpanded = (fld, el, i, disabled, rmv, expd) => {
    return (
        <React.Fragment>
            <tr key={i}>
                <td colSpan='6'>
                    <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                        <table className=''>
                            <tbody>
                            <tr>
                                <td colSpan='2'>
                                    <span className="ap-table-list-number mr12">{i + 1}</span>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>{M.ZAJAV_SENDER.label}</td>
                                <td colSpan='6'><Field disabled={disabled} component={FInput}
                                                       name={fld + M.ZAJAV_SENDER.name}
                                                       value={el[M.ZAJAV_SENDER.name]}/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>{M.ZAJAV_NDOC.label}</td>
                                <td>
                                    <Field disabled={disabled} component={FInput} name={fld + M.ZAJAV_NDOC.name}
                                           value={el[M.ZAJAV_NDOC.name]}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>{M.ZAJAV_DATE.label}</td>
                                <td>
                                    <Field disabled={disabled} component={FPicker} name={fld + M.ZAJAV_DATE.name}
                                           value={el[M.ZAJAV_DATE.name]} datepicker='+'/>
                                </td>

                            </tr>
                            <tr>
                                <td className='ap-input-caption'>{M.ZAJAV_SIGNER.label}</td>
                                <td>
                                    <Field disabled={disabled} component={FInput} name={fld + M.ZAJAV_SIGNER.name}
                                           value={el[M.ZAJAV_SIGNER.name]}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <hr className='txt-hr my18'/>
                        <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                            <Button type="text" size="small">
                                <span className='color-blue'>Свернуть</span>
                            </Button>
                            <div>
                                {disabled ? null :
                                    <Button type="text" onClick={rmv(i)}>
                                        <i className="el-icon-delete color-red-dark"/>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan='6'>
                    <hr className='txt-hr my18'/>
                </td>
            </tr>
        </React.Fragment>);
};

const ZajavRows = (props) => {
    const {fields, disabled, setExpanded, expandedId} = props;
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const expd = (el) => () => setExpanded(el.id);

    const TDS = fields.map((fld, i, arr) => {
        const el = arr.get(i);
        return (el.id == expandedId ? tdExpanded : tdCollapsed)(fld, el, i, disabled, rmv, expd);
    });

    return (
        <div>
            <hr className='txt-hr my18'/>
            <h4 className="ap-h4">{M.ORG_NAME.label}</h4>

            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных заявителей</p>

                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='wmin600 mb18'>
                                <thead>
                                <tr>
                                    <th className='ap-table__header'></th>
                                    <th className='ap-table__header'>{M.ZAJAV_NDOC.label}</th>
                                    <th className='ap-table__header'>{M.ZAJAV_SENDER.label}</th>
                                    <th className='ap-table__header'>{M.ZAJAV_DATE.label}</th>
                                    <th className='ap-table__header'>{M.ZAJAV_SIGNER.label}</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {TDS}
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
                        <table className='wmin300'>
                            <tbody>
                            <tr>
                                <td colSpan='3'>
                                    {disabled ? null :
                                        <Button size="small" icon="plus" type="success" plain={true} onClick={add}
                                                className="flex-parent mb18"
                                                title='Добавить заявителя'>Добавить</Button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>);
};


class IncLetterHead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedId: null
        }

        this.setExpanded = this.setExpanded.bind(this);
    }

    setExpanded(expandedId) {
        this.setState({expandedId});
    }

    render() {
        const {expandedId} = this.state;
        const {disabled} = this.props;
        return (
            <div>
                <h4 className="ap-h4">Основные сведения</h4>
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'>{M.INC_NUM.label}</td>
                        <td>
                            <span className='inline-block mr12'>
                                <Field disabled={disabled} component={FSelect} name={M.SER_VH_DOC.name} data={serData}/>
                            </span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>
                               <Field disabled={disabled} component={FInput} name={M.NUM_VH_DOC.name}/>
                            </span>
                        </td>
                        <td className='ap-input-caption wmin120'>{M.INC_DAT.label}</td>
                        <td>
                            <Field disabled={disabled} component={FPicker} name={M.INC_DAT.name} datepicker='+'/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <FieldArray component={ZajavRows} name='zajavs' disabled={disabled} setExpanded={this.setExpanded}
                            expandedId={expandedId}/>
            </div>
        )
    }//
}

export default reduxForm({
    form: 'letter_incoming', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IncLetterHead)