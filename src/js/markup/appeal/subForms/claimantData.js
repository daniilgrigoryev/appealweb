import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form/immutable'
import {Button, Card, Layout, Tag} from 'element-react'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {ERadio, FRadio, getOptions} from '../../components/radio.js'

import mapping from '../mapping.js'

const headerTitle  = 'Сведения о заявителе';
const sexOptions   = getOptions('1', 'мужской', '2', 'женский');
const zajavOptions = getOptions('1', 'Физическое лицо', '2', 'Юридическое лицо');
const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
const M = mapping.claimantData;

class ClaimantData extends React.Component {

    render() {
        const {handleSubmit, nextPage, prevPage, pristine, submitting, header, content, disabled} = this.props;
        const navi = !disabled && (nextPage||prevPage);
    
        let isPred = false;
        let isFL = false;

        if (content){
            isPred = !!content.get(M.PRED.name);
            isFL = content.get(M.ZAJAV_LIC.name) != 2;
        }

         const ZAJAV_SOURCE = isFL
            ? (
                <React.Fragment>
                    <Layout.Row gutter="0">
                        <Layout.Col xs="24" md="24" lg="12">
                            <table className='w-full'>
                                <tbody>
                                <tr key='flSex' className='txt-nowrap'>
                                    <td className='ap-input-caption'>{M.SEX.label}</td>
                                    <td colSpan='3' className='pb12'>
                                   <span>
                                        <Field disabled={disabled} name={M.SEX.name} component={FRadio}
                                               options={sexOptions}/>
                                   </span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Layout.Col>
                    </Layout.Row>

                    <Layout.Row gutter="0">
                        <Layout.Col xs="24" md="24" lg="12">
                            <table className='w-full'>
                                <tbody>
                                <tr key='flFam'>
                                    <td className='ap-input-caption'>{M.FAM.label}</td>
                                    <td colSpan='3'><Field disabled={disabled} name={M.FAM.name} component={FInput}/>
                                    </td>
                                </tr>
                                <tr key='flName'>
                                    <td className='ap-input-caption'>{M.NAME.label}</td>
                                    <td colSpan='3'><Field disabled={disabled} name={M.NAME.name} component={FInput}/>
                                    </td>
                                </tr>
                                <tr key='flSurname'>
                                    <td className='ap-input-caption'>{M.SURNAME.label}</td>
                                    <td colSpan='3'><Field disabled={disabled} name={M.SURNAME.name}
                                                           component={FInput}/>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Layout.Col>
                        <Layout.Col xs="24" md="24" lg="12">
                            <table className='w-full'>
                                <tbody>
                                <tr>
                                    <td className='ap-input-caption'>{M.PHONE.label}</td>
                                    <td colSpan='3'><Field disabled={disabled} name={M.PHONE.name}
                                                           component={FInput} mask={phoneMask}/></td>
                                </tr>
                                <tr>
                                    <td className='ap-input-caption'>{M.EMAIL.label}</td>
                                    <td colSpan='3'><Field disabled={disabled} name={M.EMAIL.name}
                                                           component={FInput}/></td>
                                </tr>
                                </tbody>
                            </table>
                        </Layout.Col>
                    </Layout.Row>
                </React.Fragment>
            )
            : (<Layout.Row gutter="0">
                    <Layout.Col xs="24" md="24" lg="10">
                        <table className='w-full'>
                            <tbody>
                            <tr key='ulOrgName'>
                                <td className='ap-input-caption'>{M.ORG_NAME.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.ORG_NAME.name} component={FInput}/>
                                </td>
                            </tr>
                            <tr key='ulIshNum'>
                                <td className='ap-input-caption'>{M.ISH_NUMBER.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.ISH_NUMBER.name} component={FInput}/>
                                </td>
                            </tr>
                            <tr key='ulIshDt'>
                                <td className='ap-input-caption'>{M.ISH_DATE.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.ISH_DATE.name} component={FPicker}
                                                       datepicker='+'/></td>
                            </tr>
                            </tbody>
                        </table>
                    </Layout.Col>
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='w-full'>
                            <tbody>
                            <tr key='ulINN'>
                                <td className='ap-input-caption'>{M.INN.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.INN.name} component={FInput}/></td>
                            </tr>
                            <tr key='ulKPP'>
                                <td className='ap-input-caption'>{M.KPP.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.KPP.name} component={FInput}/></td>
                            </tr>

                            <tr key='ulPodpis'>
                                <td className='ap-input-caption'>{M.PODPIS.label}</td>
                                <td colSpan='3'><Field disabled={disabled} name={M.PODPIS.name} component={FInput}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>
            );
//

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
            <Layout.Row gutter="0">
                <Layout.Col xs="24" md="12" lg="12">
                    <table className='w-full'>
                        <tbody>
                        <tr>
                            <td className='ap-input-caption'>{M.PRED_SEX.label}</td>
                            <td colSpan='3' className='pb12'><Field disabled={disabled} name={M.PRED_SEX.name}
                                                                    component={FRadio}
                                                                    options={sexOptions}/></td>
                        </tr>
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
                            <td colSpan='3'><Field disabled={disabled} name={M.PRED_SURNAME.name} component={FInput}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Layout.Col>
            </Layout.Row>
            : null;

        return (
            <div scrollanchor='claimant'>
                <Card className="box-card border-b--0" header={
                    <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                        <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                            Заявитель
                        </h3>
                    </div>
                }
                bodyStyle={{'padding-bottom': 0}}
                >
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                            <form className='ml0' onSubmit={handleSubmit}>
                                <table className='mb12'>
                                    <tbody>
                                    <tr key='flSurname'>
                                        <td className='ap-input-caption'>Тип лица</td>
                                        <td>
                                            <Field disabled={disabled}
                                                   name={M.ZAJAV_LIC.name}
                                                   component={FRadio}
                                                   options={zajavOptions}/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                {ZAJAV_SOURCE}

                                <table>
                                    <tbody>
                                    <tr key='flPred'>
                                        <td colSpan='3'>
                                            <h4 className='ap-h4'>
                                                {M.PRED.label}

                                                <Field disabled={disabled}
                                                       name={M.PRED.name}
                                                       component={FCheckbox}
                                                       className='ml6'
                                                />
                                            </h4>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                                {PREDST}
                            </form>
                        </Layout.Col>
                    </Layout.Row>
                </Card>
            </div>);
    } //
}//


const mapStateToProps = (state) => {
    const content = state.getIn(['form', 'appeal', 'values']);
    return {content};
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
