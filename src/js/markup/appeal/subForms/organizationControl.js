import React from 'react'
import * as _ from 'lodash'
import {Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {FSelect} from '../../components/select.js'
import {FAutocomplete} from '../../components/fautocomplete.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'
import mapping from '../mapping.js'
import Immutable from 'immutable'

const im = (obj) => Immutable.fromJS(obj);
const M = mapping.organizationControl;

const getRow = (id, name, num, date, control_date) => {
    return im({
        id: id || null,
        name: name || '',
        num: num || '',
        date: date || null,
        control_date: control_date || null
    })
};

// Element component
export class EOrganizationControl extends React.Component {

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);
        const ROWS = fields.map((x, i) => (
        <div className="row" key={i}>
            <div className="column w300">
                <div className="label">{M.ORG_NAME.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FAutocomplete} name={x + M.ORG_NAME.name} value={x[M.ORG_NAME.name]}  dataKey={M.ORG_NAME.key} />
                </div>
            </div>
            <div className="column w180">
                <div className="label">{M.ISH_NUM.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FInput} name={x + M.ISH_NUM.name} value={x[M.ISH_NUM.name]}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">{M.ISH_DATE.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + M.ISH_DATE.name} value={x[M.ISH_DATE.name]} datepicker='+'/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">{M.CONTR_DATE.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + M.CONTR_DATE.name} value={x[M.CONTR_DATE.name]} datepicker='+'/>
                </div>
            </div>
            <div className="column column--end">
                <div className="value">
                    {disabled ? null :
                        <div>
                            <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                                <i className="ico round minus"/>
                            </Button>
                            <Button className="py0" size="small" type="text" onClick={add}>
                                <i className="ico round plus"/>
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>));

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='my6 txt-em color-gray align-center'>Нет добавленных организаций</p>
                    :
                    <div className="flex-table">{ROWS}</div>
                }

                {disabled || fields.length ? null :
                    <Button size="small" icon="plus" plain={true} onClick={add} className="flex-parent mx-auto my6 block" title='Добавить тему'>Добавить</Button>

                }
            </React.Fragment>
        )
    }//
}
