import React from 'react'
import * as _ from 'lodash'
import {Button, Dropdown} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../../components/finput.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {FAutocomplete} from '../../../components/fautocomplete.js'
import {getAc} from '../../../../services/acCacher.js'
import FabulaDialog from '../fabulaDialog.js'
import mapping from '../../mapping.js'
import {post} from '../../../../services/ajax.js'
import {getSessionId, getSystem} from '../../../../selectors/common.js'
import Immutable from 'immutable'
import IshDocRow from './ishDocRow.js'

const im = (obj)=> Immutable.fromJS(obj);
const M = mapping.ishDocList;

const getRow = (doc_target, args = {}) => {
    const {id,ish_num, ish_date, podpisal, status, related_topic, crypto_signature, doc_vid, delivery_type, sheets_count, edo_num, comment, soprovod, universal, opred, uvedom, vyzov, initiation,claim_id} = args;
    return {
        id: id || null,
        doc_target: doc_target,
        ish_num: ish_num || '',
        ish_date: ish_date || null,
        podpisal: podpisal || '',
        status: status || '',
        related_topic: related_topic || null,
        crypto_signature: crypto_signature || false,
        doc_vid: doc_vid || null,
        delivery_type: delivery_type || null,
        sheets_count: sheets_count || '',
        edo_num: edo_num || '',
        comment: comment || '',
        files: [], // {id,name}
        claim_id: claim_id || null
    }
}

const getRowZajav = (args) => im(getRow('Заявитель ФЛ', args));
const getRowOrg   = (args) => im(getRow('Организация', args));

// Element component
class EIshDocList extends React.Component {

    constructor(props) {
        super(props);
        const eid = _.chain(this.props.fileds).first().get('id').value();
        this.state = {
            expandedId: eid,
            dialog: null
        };
    }

    dialogClose() {
        this.setState({dialog: null});
    }

    dialogOpenFabula(doc_type_id, data,related_topic_id,ish_doc_id) { 
        const cancel = this.dialogClose.bind(this);
        const done = null;
        const title = 'Исходящие документы';

        const claim_id = this.props.claim_id;
        const props = {...data, cancel, done, title, doc_type_id,claim_id,related_topic_id,ish_doc_id};
        const dialog = <FabulaDialog key={JSON.stringify(props)} {...props} />; ////
        this.setState({dialog});
    } //

    getValue(property) {
        const {acCateg} = this.state;
        return !_.size(acCateg)
            ? property
            : _.chain(acCateg).filter(x => x.property == property).first().get('value').value();
    }

    onRemove(index) {
        const P = this.props;
        const {reduxformfield, input} = P;
        const {expandedId} = this.state;

        const rows = this.props.fields;
        const rowId = rows.get(index).id;
        rows.remove(index);

        let newExpandedId = null;
        if (rowId == expandedId) {
            if (rows.length == 1) {
                newExpandedId = rows[0].id;
            } else {
                newExpandedId = rows[Math.max(0, index - 1)].id;
            }
        }
        this.setState({expandedId: newExpandedId});
    }
   
    onExpand(expandedId) {
        this.setState({expandedId})
    }

    render() {
        const rmv = this.onRemove.bind(this);
        const xpd = this.onExpand.bind(this);
        const dialogOpenFabula = this.dialogOpenFabula.bind(this);

        const {fields, disabled,claim_id,fTypes,categories} = this.props;
        const fabData = {};
        const DIALOG = this.state.dialog;

        const add = (rowGetter) => () => fields.push(rowGetter());
        const ROWS = fields.map((x, i, arr) => (
            <IshDocRow key={i} ind={i} field={x} value={arr.get(i)} checkExpand={(x) => x === this.state.expandedId}
                   onRemove={rmv} onExpand={xpd} onFabula={dialogOpenFabula} fabData={fabData} claim_id={claim_id} fTypes={fTypes}
                   disabled={disabled} categories={categories} collapse={()=>this.setState({expandedId:false})}>{x.value}
            </IshDocRow>)); //
        
        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='mt-neg18 mb18 txt-em color-gray'>Нет исходящих документов</p>
                    :
                    <table key='idl1' className='w-full mb18'>
                        <thead>
                        <tr>
                            <th className='ap-table__header'>№</th>
                            <th className='ap-table__header'>{M.DOC_TARGET.label}</th>
                            <th className='ap-table__header'>{M.ISH_NUM.label}</th>
                            <th className='ap-table__header'>{M.ISH_DATE.label}</th>
                            <th className='ap-table__header'>{M.PODPISAL.label}</th>
                            <th className='ap-table__header'>{M.STATUS.label}</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {ROWS}
                        </tbody>
                    </table>
                }

                <div className='flex-parent'>
                    {disabled ? null :
                        <Button size="small" icon="plus" type="success" plain={true} onClick={add(getRowZajav)}
                                className="flex-parent mb18"
                                title='Добавить тему'>Проект документов для заявителя</Button>}

                    {disabled ? null :
                        <Button size="small" icon="plus" type="success" plain={true} onClick={add(getRowOrg)}
                                className="flex-parent mb18"
                                title='Добавить тему'>Проект документов для организации</Button>}
                </div>
                {DIALOG}
            </React.Fragment>
        )
    }
}

const FIshDocList = (props) => {
    const {input, meta} = props;
    return <EIshDocList {...props} {...input} {...meta} reduxformfield="true"/>
}  //
//

export {EIshDocList, FIshDocList};