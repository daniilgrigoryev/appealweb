import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../../components/fautocomplete.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {Button} from 'element-react'
import * as _ from 'lodash'
import mapping from '../mapping.js'

const M = mapping.outLetterHead;

const serData = ['78-10', '78-11', '78-21', '78-20'];

const getRow = (id,zajavTo) => {
    return {
        id: id || null,
        zajavTo: zajavTo || ''
    }
}

const ZajavRows = (props) => {
    const {fields, disabled, setExpanded, expandedId} = props;
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const expd = (el) => () => setExpanded(el.id);

    const TDS = fields.map((fld, i, arr) => {
        const el = arr.get(i);
        return (<tr key={i}>
            <td>
                <span className="ap-table-list-number mr12">{i + 1}</span>
            </td>
            <td>
                <Field disabled={disabled} component={FInput}
                       name={fld + M.ZAJAV_NDOC.name}
                       value={el[M.ZAJAV_NDOC.name]}
                       placeholder='Имя адресата'/>
            </td>
            <td>
                {disabled ? null :
                    <Button size="small" type="text" onClick={rmv(i)}>
                        <i className="el-icon-close color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>);
    });

    return (
        <React.Fragment>
            <hr className='txt-hr my18'/>
            <h4 className="ap-h4">Список адресатов</h4>

            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных адресатов</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='mb18'>
                                <thead>
                                <tr>
                                    <th className='ap-table__header'></th>
                                    <th className='ap-table__header wmin360'>Кому:</th>
                                    <th className='ap-table__header'></th>
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
                                        <Button size="small" icon="plus" onClick={add} type="success" plain={true}
                                                className="flex-parent mb18"
                                                title='Добавить адресата'>Добавить</Button>
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


class OutLetterHead extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expandedId: null
        };

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
                        <td className='ap-input-caption'>{M.ZAJAV_NDOC.label}</td>
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
                        <td className='ap-input-caption wmin60'>{M.ZAJAV_DATE.label}</td>
                        <td>
                            <Field disabled={disabled} component={FPicker} name={M.INC_DAT.name} datepicker='+'/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'>{M.SIGNER.label}</td>
                        <td><Field disabled={disabled} component={FInput} name={M.SIGNER.name}/></td>

                        <td className='ap-input-caption'>{M.ZAJAV_SIGNER.label}</td>
                        <td><Field disabled={disabled} component={FAutocomplete} name={M.ZAJAV_SIGNER.name} dataKey={M.ZAJAV_SIGNER.key}/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <FieldArray component={ZajavRows} name='zajavs' disabled={disabled} setExpanded={this.setExpanded}
                            expandedId={expandedId}/>

            </div>
        )
    }
}

export default reduxForm({
    form: 'letter_outcoming', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(OutLetterHead)