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
        const dataKeyDecisions = 'DECISIONS_' + sys;

        // const textareaSt = {width: '100%'};

        return (
            <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                <table className='w-full'>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'>Категория</td>
                        <td><EAutocomplete value={s.CATEGORY_ID} onChange={(v) => this.setVal('CATEGORY_ID', v)}
                                           dataKey='CLAIM_CATEGORIES'/></td>

                        <td className='ap-input-caption'>Решение</td>
                        <td><EAutocomplete value={s.DECISION_ID} onChange={(v) => this.setVal('DECISION_ID', v)}
                                           dataKey={dataKeyDecisions}/></td>

                        <td></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>Наименование</td>
                        <td><EInput value={s.NAME} onChange={(v) => this.setVal('NAME', v)}/></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption align-t'>Содержимое</td>
                        <td colSpan='3'>
                            <Input
                                type="textarea"
                                value={s.CONTENT} onChange={(v) => this.setVal('CONTENT', v.target.value)}
                                autosize={{ minRows: 6, maxRows: 20}}
                            />

                            {/*<textarea value={s.CONTENT} onChange={(v) => this.setVal('CONTENT', v.target.value)}*/}
                                      {/*style={textareaSt}/>*/}
                        </td>
                        <td></td>
                    </tr>
                    </tbody>
                </table>

                <hr className='txt-hr my18'/>
                <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                   <div>
                       <Button size="small" type='info' plain={true} onClick={() => this.ajax('FABULA_SEC_PUSH')}>Сохранить</Button>
                       <Button type='text' onClick={cancelEdit} className='ml24'>Отмена</Button>
                   </div>
                    <div>
                        <Button type="text" onClick={() => this.ajax('FABULA_SEC_REMOVE')}>
                                <i className="el-icon-delete color-red-dark"/>
                            </Button>

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