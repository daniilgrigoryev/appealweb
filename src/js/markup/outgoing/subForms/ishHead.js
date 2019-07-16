import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import Immutable from 'immutable'
import {Button, Card, Layout} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.ishHead;

const im = (obj) => Immutable.fromJS(obj)

const nDoc = [{property: '78-08', value: '78-08'}, 
             {property: '78-00', value: '78-00'}];

const getRow = (id, addr) => {
    return im({
        id: id || null,
        addr: addr || null
    })
}

const addressee = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const ROWS = fields.map((x, i) => (
        <div className="row" key={i}>
            <div className="column">
                <div className="label">Кому:</div>
                <div className="value">
                    <Field disabled={disabled} component={FInput} name={x + M.ADDR.name} value={x[M.ADDR.name]} placeholder='Имя адресата'/>
                </div>
            </div>
            <div className="column column--end">
                <div className="value">
                {disabled ? null :
                    <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                        <i className="ico round minus"/>
                    </Button>
                }
                {disabled ? null :
                    <Button className="py0" size="small" type="text" onClick={add} plain={true}>
                        <i className="ico round plus"/>
                    </Button>
                }
                </div>
            </div>
        </div>));

    return (
        <div>
            {!fields.length  ?
                <p className='my6 txt-em color-gray align-center'>Нет добавленных адресатов</p>
                :
                <div className="flex-table mb6">
                    {ROWS}
                </div>
            }

            {disabled || fields.length ? null :
                <Button size="small" icon="plus" onClick={add} plain={true} className="mb18 mt6 mx-auto block" title='Добавить адресата'>Добавить</Button>
            }
        </div>
    );
};

class IshHead extends React.Component {//
    render() {
        const {disabled,notInsert} = this.props

        return (
            <React.Fragment>
                <div scrollanchor="addBasic" id="addBasic">
                    <Card className="box-card sectionCard" header={
                        <div className='headline'>
                            <h3>Дополнительные сведения</h3>
                        </div>
                    }>
                        <div className="form-container">
                            <div className="wrap">
                                <div className="item">
                                    <small className="label">{M.ZAJAV_NDOC.label}</small>
                                    <div className="value">
                                        {notInsert 
                                            ? <Field disabled={true} readonly={true} component={FInput} name='registration_number'/>
                                            : <div className="flex-parent">
                                                <Field disabled={disabled || notInsert} readonly={disabled || notInsert} component={FSelect} name={M.DOC_NUM.name} data={nDoc}/>
                                                <Field disabled={disabled || notInsert} readonly={disabled || notInsert} component={FInput} name={M.ORDER_NUM.name} className="ml18"/>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="item item--left">
                                    <small className="label">{M.DOC_DAT.label}</small>
                                    <div className="value w130">
                                        <Field disabled={disabled} component={FPicker} name={M.DOC_DAT.name} datepicker='+'/>
                                    </div>
                                </div>
                                <div className="item">
                                    <small className="label">{M.SIGNER.label}</small>
                                    <div className="value">
                                        <Field disabled={disabled} component={FInput} name={M.SIGNER.name}/>
                                    </div>
                                </div>
                                <div className="item">
                                    <small className="label">{M.EXECUTOR.label}</small>
                                    <div className="value">
                                        <Field disabled={disabled} component={FAutocomplete} name={M.EXECUTOR.name} dataKey={M.EXECUTOR.key}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <div scrollanchor="destinations" id="destinations">
                    <Card className="box-card sectionCard" header={
                        <div className='headline'>
                            <h3>Список адресатов</h3>
                        </div>
                    }>
                        <div className="form-container">
                            <FieldArray name='addressee' component={addressee} disabled={disabled}/> 
                        </div>
                    </Card>
                </div>
            </React.Fragment>
        );
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshHead)