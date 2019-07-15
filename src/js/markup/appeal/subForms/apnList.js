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
import {post} from '../../../services/ajax.js'
import {Dialog} from 'primereact/dialog';
import {messageSet} from '../../../actions/common.js'

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

    constructor(props){
        super(props);
        this.state = {
            apnViolator: null,
            apnText: null,
            apnNum:null,
            apnDate:null
        }
    
        this.showApn = this.showApn.bind(this);
        this.hideApn = this.hideApn.bind(this);
    }

    showApn(apnViolator,apnText,apnNum,apnDate){
        this.setState({apnViolator,apnText,apnNum,apnDate});
    }

    hideApn(){
        this.showApn(null,null,null,null);
    }

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);

        const inf = (x,i,arr) => async (evt) =>{
            const denormalize = true;
            const alias = 'AP_PROT_SEARCH';
            const el = evt.target || evt.currentTarget;
            const map = arr.get(i);
            const prot_n = map.get('apn');
            const prot_date = map.get('date');
            
            const response = await post('db/select',{alias,prot_n,prot_date,denormalize}); 
            const rec = _.first(response.data);
            
            if (!rec){
                messageSet('Не удалось найти постановление в АП','error');
            } else {
                this.showApn(rec.VIOLATOR,rec.PROT_TEXT,prot_n,prot_date);
            }
        };

        const ROWS = fields.map((x,i,arr) => (
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
                        <Button type="text" onClick={inf(x,i,arr)}>
                            <i className="ico round info"/>
                        </Button>}
                   {disabled ? null :
                        <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                            <i className="ico round minus"/>
                        </Button>}
                    {disabled ? null : 
                        <Button className="py0" size="small" type="text" onClick={add}>
                            <i className="ico round plus"/>
                        </Button>}
               </div>
            </div>
        </div>));

        const {apnViolator,apnText,apnNum,apnDate} = this.state;
        const noApnDialog = !apnViolator && !apnText;

        return (
            <React.Fragment>
                {!fields.length 
                    ? <p className='my6 txt-em color-gray align-center'>Нет добавленных постановлений</p>
                    : <div className="flex-table">{ROWS}</div>}

                {disabled || fields.length ? null :
                    <Button size="small" icon="plus" plain={true} onClick={add}
                            className="mx-auto my6 block"
                            title='Добавить тему'>Добавить</Button>}


                {noApnDialog ? null :  
                    <Dialog header="Информация о постановлении" className="style-modal" visible={true} style={{width: '50vw'}} closable={false} >
                        <table>
                            <tbody>
                                <tr>
                                    <td>Постановление</td>
                                    <td>{apnNum}</td>
                                </tr>
                                <tr>
                                    <td>Дата</td>
                                    <td>{apnDate}</td>
                                </tr>
                                <tr>
                                    <td>Нарушитель</td>
                                    <td>{apnViolator}</td>
                                </tr>
                                <tr>
                                    <td>Информация</td>
                                    <td>{apnText}</td>
                                </tr>
                                <tr>
                                    <td><Button onClick={()=>this.hideApn()} >Закрыть</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </Dialog>}
            </React.Fragment>
        );
    }//
}
