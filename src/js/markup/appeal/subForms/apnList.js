import React from 'react'
import * as _ from 'lodash'
import Immutable from 'immutable'
import {Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'
import mapping from '../mapping.js'

const im = (obj) => Immutable.fromJS(obj);
const M = mapping.apnList;

const getRow = (id,apn, date) => {
    return im({
        id: id || null,
        apn: apn || null,
        date: date || null
    })
}

// Element component
export class EApnList extends React.Component {

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);
        // const inf = (ind) => () => fields.remove(ind);

        const ROWS = fields.map((x, i) => (
        <div className="row" key={i}>
            <div className="column w300">
                <div className="label">{M.POST_NUM.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FInput} name={x + M.POST_NUM.name} value={x[M.POST_NUM.name]}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">{M.DATE.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + M.DATE.name} value={x[M.DATE.name]} date='+'/>
                </div>
            </div>
            <div className="column column--end">
               <div className="value">
                    {disabled ? null :
                        <Button type="text">
                            <i className="ico round info"/>
                        </Button>
                    }
                   {disabled ? null :
                        <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                            <i className="ico round minus"/>
                        </Button>
                    }
                    {disabled ? null : 
                        <Button className="py0" size="small" type="text" onClick={add}>
                            <i className="ico round plus"/>
                        </Button>
                    }
               </div>
            </div>
        </div>));

        return (
            <React.Fragment>
                {!fields.length 
                    ? <p className='my6 txt-em color-gray align-center'>Нет добавленных постановлений</p>
                    : <div className="flex-table">{ROWS}</div>
                }

                {disabled || fields.length ? null :
                    <Button size="small" icon="plus" plain={true} onClick={add}
                            className="mx-auto my6 block"
                            title='Добавить тему'>Добавить</Button>}
            </React.Fragment>
        );
    }//
}
