import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Input, Radio} from 'element-react'

import AppealTable from '../../table/table.js'
import {post} from '../../../services/ajax.js'
import {getSessionId} from '../../../selectors/common.js'
import mapping from '../mapping.js'

const M = mapping.docLinker;

const desc = {
    alias: 'APPEAL_LIST'
}

class DocLinker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            npost: null,
            fio: null,
            numberIn: null,
            numberOut: null,
            target: 'IN_APPEAL',

            rows: [],
            selected: [],

            searchDesc: {}
        }

        this.getSelected = null;

        this.registerGetSelected = this.registerGetSelected.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onSetTarget = this.onSetTarget.bind(this);
    };

    registerGetSelected(outerGetSelected) {
        this.getSelected = outerGetSelected;
    }

    getSearchDesc() {
        const {npost, fio, numberIn, numberOut} = this.state;
        return {npost, fio, numberIn, numberOut};
    }

    onSearch() {
        const searchDesc = this.getSearchDesc();
        this.setState({searchDesc});
    }

    onSetTarget(target) {
        this.setState({target});
    }

    onInput(id) {
        return (value) => this.setState({[id]: value});
    }

    render() {
        const S = this.state;
        const {target, searchDesc} = this.state;
        const {dialogLink, dialogClose} = this.props;

        const performLink = () => {
            const args = this.getSelected();
            dialogLink(args);
        }

        const searchEmpty = _.isEmpty(searchDesc);
        const TABLE = searchEmpty
            ? (<div className='mt18 py36'>
                <h4 className='txt-h4 align-center color-darken10'>Условие для поиска не задано</h4>
            </div>)
            : (<AppealTable sid={this.props.sid} desc={Object.assign({}, searchDesc, desc)}
                            registerGetSelected={this.registerGetSelected}/>);

        return (
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td className="ap-input-caption">{M.POST_NUMBER.label}</td>
                        <td><Input id={M.POST_NUMBER.name} value={S[M.POST_NUMBER.name]}
                                   onChange={this.onInput(M.POST_NUMBER.name)}/></td>
                        <td className="ap-input-caption">{M.FIO_ORG.label}</td>
                        <td><Input id={M.FIO_ORG.name} value={S[M.FIO_ORG.name]}
                                   onChange={this.onInput(M.FIO_ORG.name)}/></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="ap-input-caption">{M.INCOM_NUM.label}</td>
                        <td><Input id={M.INCOM_NUM.name} value={S[M.INCOM_NUM.name]}
                                   onChange={this.onInput(M.INCOM_NUM.name)}/></td>
                        <td className="ap-input-caption">{M.OUTC_NUM.label}</td>
                        <td><Input id={M.OUTC_NUM.name} value={S[M.OUTC_NUM.name]}
                                   onChange={this.onInput(M.OUTC_NUM.name)}/></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className="ap-input-caption">Поиск по</td>
                        <td><Radio value={M.IN_APPEAL.name} checked={target === M.IN_APPEAL.name}
                                   onChange={this.onSetTarget}>{M.IN_APPEAL.label}</Radio></td>
                        <td><Radio value={M.OUT_APPEAL.name} checked={target === M.OUT_APPEAL.name}
                                   onChange={this.onSetTarget}>{M.OUT_APPEAL.label}</Radio></td>
                        <td><Radio value={M.INTRA_DOCS.name} checked={target === M.INTRA_DOCS.name}
                                   onChange={this.onSetTarget}>{M.INTRA_DOCS.label}</Radio></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colSpan='4' className=''>
                            <div className='flex-parent flex-parent--center-cross mt24'>
                                <Button size="small" type='primary' icon="search" onClick={this.onSearch}
                                        className="flex-parent mb18"
                                        title='Добавить тему'>Поиск</Button>

                                <Button size="small" icon="share" onClick={performLink}
                                        className="flex-parent mb18"
                                        title='Добавить тему'>Связать</Button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                {TABLE}

            </div>
        ); //
    }
}; //


const state2props = (state) => {
    return {sid: getSessionId(state)};
}

export default connect(state2props)(DocLinker)