import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {ERadio, FRadio, getOptions} from '../../components/radio.js'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from './mapping.js'

const headerTitle = 'Сведения о заявителе';
const sexOptions = getOptions('1', 'мужской', '2', 'женский');
const zajavOptions = getOptions('1', 'Физическое лицо', '2', 'Юридическое лицо');
const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const M = mapping.claimantData;

class ClaimantData extends React.Component {

    render() {
        const {handleSubmit, nextPage, prevPage, pristine, submitting, header, content, disabled} = this.props;

        const isPred = !!content[M.PRED.name];
        const isFL = content[M.ZAJAV_LIC.name] != 'UL';

        const ZAJAV_SOURCE = isFL
            ? (
                <table>
                    <tbody>
                    <tr key='flFam'>
                        <td className='ap-input-caption'>{M.FAM.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.FAM.name} component={FInput}/></td>
                    </tr>
                    <tr key='flName'>
                        <td className='ap-input-caption'>{M.NAME.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.NAME.name} component={FInput}/></td>
                    </tr>
                    <tr key='flSurname'>
                        <td className='ap-input-caption'>{M.SURNAME.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.SURNAME.name} component={FInput}/></td>
                    </tr>
                    <tr key='flSex'>
                        <td className='ap-input-caption'>{M.SEX.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.SEX.name} component={FRadio} options={sexOptions}/></td>
                    </tr>
                    </tbody>
                </table>
            )
            : (<table>
                    <tbody>
                    <tr key='ulOrgName'>
                        <td className='ap-input-caption'>{M.ORG_NAME.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.ORG_NAME.name} component={FInput}/></td>
                    </tr>
                    <tr key='ulINN'>
                        <td className='ap-input-caption'>{M.INN.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.INN.name} component={FInput}/></td>
                    </tr>
                    <tr key='ulKPP'>
                        <td className='ap-input-caption'>{M.KPP.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.KPP.name} component={FInput}/></td>
                    </tr>
                    <tr key='ulIshNum'>
                        <td className='ap-input-caption'>{M.ISH_NUMBER.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.ISH_NUMBER.name} component={FInput}/></td>
                    </tr>
                    <tr key='ulIshDt'>
                        <td className='ap-input-caption'>{M.ISH_DATE.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.ISH_DATE.name} component={FPicker}
                                               datepicker='+'/></td>
                    </tr>
                    <tr key='ulPodpis'>
                        <td className='ap-input-caption'>{M.PODPIS.label}</td>
                        <td colSpan='3'><Field disabled={disabled} name={M.PODPIS.name} component={FInput}/></td>
                    </tr>
                    </tbody>
                </table>
            );


        const KVART = isFL
            ? ([
                <td key='kvFl1' className='ap-input-caption'>{M.KVART.label}</td>,
                <td key='kvFl2'><Field disabled={disabled} name={M.KVART.name} component={FInput}/></td>
            ])
            : ([
                <td key='kvUl1' className='ap-input-caption'>{M.OFFICE.label}</td>,
                <td key='kvUl2'><Field disabled={disabled} name={M.OFFICE.name} component={FInput}/></td>
            ]);
//

        const PREDST = isPred ?
            <table>
                <tbody>
                <tr key='flPredFam'>
                    <td className='ap-input-caption'>{M.PRED_FAM.label}</td>
                    <td colSpan='3'><Field disabled={disabled} name={M.PRED_FAM.name} component={FInput}/></td>
                </tr>
                <tr key='flPredName'>
                    <td className='ap-input-caption'>{M.PRED_NAME.label}</td>
                    <td colSpan='3'><Field disabled={disabled} name={M.PRED_NAME.name} component={FInput}/></td>
                </tr>
                <tr key='flPredSurname'>
                    <td className='ap-input-caption'>{M.PRED_SURNAME.label}</td>
                    <td colSpan='3'><Field disabled={disabled} name={M.PRED_SURNAME.name} component={FInput}/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>{M.PRED_SEX.label}</td>
                    <td colSpan='3'><Field disabled={disabled} name={M.PRED_SEX.name} component={FRadio} options={sexOptions}/></td>
                </tr>
                </tbody>
            </table>
            : null;

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
                                        <Tag type="gray" className='mx12'>2/8</Tag>

                                        <Button.Group>
                                            <Button type="primary" size='small' icon="arrow-left" onClick={prevPage}/>
                                            <Button type="primary" size='small' onClick={nextPage}>
                                                <i className="el-icon-arrow-right el-icon-right"/>
                                            </Button>
                                        </Button.Group>
                                    </div>)
                                }
                            </div>
                        }>
                            <form onSubmit={handleSubmit}>
                                <table>
                                    <tbody>
                                    <tr key='flSurname'>
                                        <td colSpan='2'>
                                            <h4 className='ap-h4'>Тип лица</h4>
                                            <Field disabled={disabled}
                                                   name={M.ZAJAV_LIC.name}
                                                   component={FRadio}
                                                   options={zajavOptions}/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                <hr className='txt-hr my18'/>

                                <table>
                                    <tbody>
                                    <tr key='flPred'>
                                        <td colSpan='3'>
                                            <h4 className='ap-h4'>
                                                <Field disabled={disabled}
                                                       name={M.PRED.name}
                                                       component={FCheckbox}
                                                       className='mr3'
                                                />
                                                {M.PRED.label}
                                            </h4>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                {PREDST}

                                <hr className='txt-hr my12'/>

                                <h4 className='ap-h4'>
                                    Основные сведения
                                </h4>
                                {ZAJAV_SOURCE}

                                <hr className='txt-hr my18'/>

                                <h4 className='ap-h4'>
                                    Контактная информация
                                </h4>

                                <table>
                                    <tbody>
                                    <tr>
                                        <td className='ap-input-caption'>{M.PHONE.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.PHONE.name} component={FInput} mask={phoneMask}/></td>
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.EMAIL.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.EMAIL.name} component={FInput}/></td>
                                    </tr>
                                    </tbody>
                                </table>

                                <hr className='txt-hr my18'/>

                                <h4 className='ap-h4'>
                                    Адрес
                                </h4>

                                <table>
                                    <tbody>
                                    <tr>
                                        <td className='ap-input-caption'>{M.REGION.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.REGION.name} component={FAutocomplete} dataKey={M.REGION.key}/></td>
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.RAYON.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.RAYON.name} component={FInput}/></td>
                                    </tr>

                                    <tr>
                                        <td className='ap-input-caption'>{M.NPUNKT.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.NPUNKT.name} component={FInput}/></td>
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.STREET.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.STREET.name} component={FInput}/></td>
                                    </tr>

                                    <tr>
                                        <td className='ap-input-caption'>{M.DOM.label}</td>
                                        <td><Field disabled={disabled} name={M.DOM.name} component={FInput}/></td>
                                        <td className='ap-input-caption'>{M.KORPUS.label}</td>
                                        <td><Field disabled={disabled} name={M.KORPUS.name} component={FInput}/></td>
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.STR.label}</td>
                                        <td><Field disabled={disabled} name={M.STR.name} component={FInput}/></td>
                                        {KVART}
                                    </tr>
                                    <tr>
                                        <td className='ap-input-caption'>{M.PINDEX.label}</td>
                                        <td colSpan='3'><Field disabled={disabled} name={M.PINDEX.name} component={FInput}/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </form>
                        </Card>
                    </Layout.Col>
                </Layout.Row>
            </div>);
    } //
}//


const mapStateToProps = (state) => {
    const V = state.getIn(['form', 'appeal', 'values']);
    return {content: V ? V.toJS() : {}};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(ClaimantData)