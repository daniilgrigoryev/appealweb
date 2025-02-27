import * as _ from 'lodash'
import Immutable from 'immutable'
import React, { useState,useRef } from 'react'
import {Button, Card, Layout, Tag, Switch} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import { change } from 'redux-form'
import {EInput, FInput} from '../../../components/finput.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {EAutocomplete, FAutocomplete} from '../../../components/fautocomplete.js'
import {getAc} from '../../../../services/acCacher.js'
import {fields, categories, matrix} from '../../categories.js'
import {post} from '../../../../services/ajax.js'
import {messageSet} from '../../../../actions/common.js'
import mapping from '../../mapping.js'
import TopicRow from './topicRow'
         
const im = (obj)=> Immutable.fromJS(obj);
const M = mapping.topicList;

const getRow = (id,category, post_n, post_date, docs, cause, uch_pris, apn_adr, apn_date, description, owner, owner_adr, decision, decision_base, chief, decision_date, article, regno) => {
    return im({
        id: id||null,
        category: category || '',
        post_n: post_n || '',
        post_date: post_date || null,
        docs: docs || 'Отсутствуют',
        cause: cause || '',
        uch_pris: !!uch_pris || false,
        apn_adr: apn_adr || '',
        apn_date: apn_date || null,
        description: description || '',
        owner: owner || '',
        owner_adr: owner_adr || '',
        decision: decision || null,
        decision_base: decision_base || null,
        chief: chief || null,
        decision_date: decision_date || null,
        article: article || '',
        regno: regno || ''
    })
}

// Element component
class ETopicList extends React.PureComponent {

    constructor(props) {
        super(props);
      
        this.state = {
            acCateg: null,
            expandedId: -1
        };

        const theme_id = sessionStorage.getItem('show_theme');
        sessionStorage.removeItem('show_theme');
        if (theme_id){
            this.state.expandedId = this.props.fields.getAll().findIndex(x=>x.get('id')==theme_id);
            setTimeout(()=>(document.querySelector(`div[theme_id="${theme_id}"]`).scrollIntoView()),500);
        }
    }

    componentDidMount(){
        const alias = 'CLAIM_CATEGORIES';
        const listValueField = 'value';
        post('db/select',{alias,listValueField}).then(x=>{
            let acCateg = x.data;
            this.setState({acCateg})
        });
    }

    getCategValue(property) {
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

    onInfo(rowId) {
        ;
    }

    onExpand(expandedId) {
        this.setState({expandedId});
    }

    render() {
        const onRemove = this.onRemove.bind(this);
        const onInfo = this.onInfo.bind(this);
        const onExpand = this.onExpand.bind(this);
        const getValue = this.getCategValue.bind(this);

        const {fields, disabled,claim_id,dispatch,apn_list,sessionId,responseMode,adminMode,reloadRow,noChanges,adm_app,externalSid} = this.props;

        const ROWS = fields.map((field, ind, arr) => (
            <TopicRow key={ind}
                   checkExpand={(x) => x == this.state.expandedId}
                   collapse={()=>this.setState({expandedId:-1})}
                   value={arr.get(ind)}                   
                   {...{field,ind,apn_list,claim_id,dispatch,sessionId,fields,onRemove,onInfo,onExpand,getValue,disabled,responseMode,adminMode,reloadRow,noChanges,adm_app,externalSid}}>
                {field.value}
            </TopicRow>)); //
        const add = () => fields.push(im(getRow())); 

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='my6 txt-em color-gray align-center'>Нет добавленных тем обращения</p>
                    :
                    <React.Fragment>{ROWS}</React.Fragment>
                }

                {(disabled || responseMode || adminMode) ? null :
                    <Button size="small" icon="plus" plain={true} onClick={add}
                            className={`flex-parent mx-auto block ${!fields.length ? 'my6' : 'mt18'}`}
                            title='добавить тему обращения'>Новая тема обращения</Button>
                }
            </React.Fragment>
        )
    }; //
}

const FTopicList = React.memo(props => {
   const {input, meta} = props;
    return <ETopicList {...props} {...input} {...meta} reduxformfield="true"/>
});

export {ETopicList, FTopicList};
