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

        console.log(content, 'content');
    
        let isPred = false;
        let isFL = false;

        if (content){
            isPred = !!content.get(M.PRED.name);
            isFL = content.get(M.ZAJAV_LIC.name) != 2;
        }

         const ZAJAV_SOURCE = isFL
            ? (
                <React.Fragment>
                    <div className="item item--left" key='flSex'>
                        <small className="label">{M.SEX.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.SEX.name} component={FRadio} options={sexOptions}/>
                        </div>
                    </div>
                    <div className="item item--right" key='flFam'>
                        <small className="label">{M.FAM.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.FAM.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--right" key='flName'>
                        <small className="label">{M.NAME.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.NAME.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--right" key='flSurname'>
                        <small className="label">{M.SURNAME.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.SURNAME.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--left">
                        <small className="label">{M.PHONE.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.PHONE.name} component={FInput} mask={phoneMask}/>
                        </div>
                    </div>
                    <div className="item item--left">
                        <small className="label">{M.EMAIL.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.EMAIL.name} component={FInput}/>
                        </div>
                    </div>
                </React.Fragment>
            )
            : (<React.Fragment>
                    <div className="item item--left" key='ulOrgName'>
                        <small className="label">{M.ORG_NAME.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.ORG_NAME.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--left" key='ulIshNum'>
                        <small className="label">{M.ISH_NUMBER.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.ISH_NUMBER.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--left" key='ulIshDt'>
                        <small className="label">{M.ISH_DATE.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.ISH_DATE.name} component={FPicker} datepicker='+'/>
                        </div>
                    </div>
                    <div className="item item--right" key='ulINN'>
                        <small className="label">{M.INN.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.INN.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--righ" key='ulKPP'>
                        <small className="label">{M.KPP.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.KPP.name} component={FInput}/>
                        </div>
                    </div>
                    <div className="item item--righ" key='ulPodpis'>
                        <small className="label">{M.PODPIS.label}</small>
                        <div className="value">
                            <Field disabled={disabled} name={M.PODPIS.name} component={FInput}/>
                        </div>
                    </div>
                </React.Fragment>
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
            <React.Fragment>
                <div className="item item--left">
                    <small className="label">{M.PRED_SEX.label}</small>
                    <div className="value">
                        <Field disabled={disabled} name={M.PRED_SEX.name} component={FRadio} options={sexOptions}/>
                    </div>
                </div>
                <div className="item item--left" key='flPredFam'>
                    <small className="label">{M.PRED_FAM.label}</small>
                    <div className="value">
                        <Field disabled={disabled} name={M.PRED_FAM.name} component={FInput}/>
                    </div>
                </div>
                <div className="item item--left" key='flPredName'>
                    <small className="label">{M.PRED_NAME.label}</small>
                    <div className="value">
                        <Field disabled={disabled} name={M.PRED_NAME.name} component={FInput}/>
                    </div>
                </div>
                <div className="item item--left" key='flPredSurname'>
                    <small className="label">{M.PRED_NAME.label}</small>
                    <div className="value">
                        <Field disabled={disabled} name={M.PRED_SURNAME.name} component={FInput}/>
                    </div>
                </div>
            </React.Fragment>
            : null;

        return (
            <div scrollanchor='claimant' id='claimant'>
                <Card className="box-card sectionCard" header={
                    <div className='headline'>
                        <h3>Заявитель</h3>
                    </div>
                }>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form-container">
                            <div className="wrap">
                                <div className="item" key='flSurname'>
                                    <small className="label">Тип лица</small>
                                    <div className="value">
                                        <Field disabled={disabled} name={M.ZAJAV_LIC.name} component={FSelect}
                                                    placeholder={M.ZAJAV_LIC.label}
                                                    dataKey={M.ZAJAV_LIC.key}/>
                                    </div>
                                </div>
                                {ZAJAV_SOURCE}
                                <div className="item item--left" key='flPred'>
                                    <small className="label">{M.PRED.label}</small>
                                    <div className="value">
                                        <Field disabled={disabled} name={M.PRED.name} component={FCheckbox}/>
                                    </div>
                                </div>
                                {PREDST}
                            </div>
                        </div>
                    </form>
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
