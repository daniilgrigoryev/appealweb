import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Input} from 'element-react'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EInput} from '../components/finput.js'
import {getSessionId, getSystem} from '../../selectors/common.js'
import {mpt, get} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'
import {FInput} from "../components/finput";

class FabulaSecEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({system: props.sys, doc_id: props.doc_id}, props.fabSec);

        this.ajax = this.ajax.bind(this);
    }

    setVal(field, value) {
        this.setState({[field]: value})
    }

    ajax(alias) {
        const {reloadParent, cancelEdit} = this.props;
        const s = Object.assign({alias}, this.state);

        mpt('db/pushMultipart', s).then(x => {
            console.log(x);
            cancelEdit();
            reloadParent();
        }).catch(x => {
            console.error(x);
        });
    }

    render() {
        const {sys, cancelEdit} = this.props;
        const s = this.state;
        const dataKeyDecisions = 'DECISIONS';

        // const textareaSt = {width: '100%'};

        return (
            <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                <div className="wrap">
                    <div className="item">
                        <small className="label">Категория</small>
                        <div className="value">
                            <EAutocomplete value={s.CATEGORY_ID} onChange={(v) => this.setVal('CATEGORY_ID', v)} dataKey='CLAIM_CATEGORIES'/>
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">Решение</small>
                        <div className="value">
                            <EAutocomplete value={s.DECISION_ID} onChange={(v) => this.setVal('DECISION_ID', v)} dataKey={dataKeyDecisions}/>
                        </div>
                    </div>
                    <div className="item item--full">
                        <small className="label">Наименование</small>
                        <div className="value">
                            <EInput value={s.NAME} onChange={(v) => this.setVal('NAME', v)}/>
                        </div>
                    </div>
                    <div className="item item--full">
                        <small className="label">Содержимое</small>
                        <div className="value">
                            <EInput
                                type="textarea"
                                value={s.CONTENT} onChange={(v) => this.setVal('CONTENT', v)}
                                autosize={{ minRows: 6, maxRows: 20}}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross bg-white px18 py12'>
                    <div>
                        <Button size="small" type="text" onClick={() => this.ajax('FABULA_SEC_REMOVE')}>
                            <i className="el-icon-delete color-red-dark" style={{'fontSize': '18px'}}/>
                        </Button>
                    </div>
                    <div>
                        <Button type='info'  size="small" plain={true} onClick={() => this.ajax('FABULA_SEC_PUSH')}>Сохранить</Button>
                        <Button type='text' onClick={cancelEdit} className='ml24'>Отмена</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const state2props = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state);
    return {sid, sys};
}

export default connect(state2props)(FabulaSecEditor);