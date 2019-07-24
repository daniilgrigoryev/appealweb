import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post} from '../../services/ajax.js'
import Immutable from 'immutable'
import {messageSet} from '../../actions/common.js'
import {getSessionId, getSystem} from '../../selectors/common.js'
import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'
import Scrollspy from 'react-scrollspy'

const im = (obj) => Immutable.fromJS(obj)

const hashCode = (s) => (s || '').split('').reduce((hash, val) => (((hash << 5) - hash) + val.charCodeAt(0)) | 0, 0);

const alias = 'CLAIM_OUT_PUSH'


const scrollNavi = (attr) => {
    return () => {
        const el = document.querySelector('div[scrollanchor="' + attr + '"]');
        el && el.scrollIntoView();
    }
}


class Outgoing extends React.Component {

    constructor(props) {
        super(props);
        this.checkIn = this.checkIn.bind(this);
        this.reloadRow = this.reloadRow.bind(this);
        this.setFiles = this.setFiles.bind(this);
        this.curHash = 0;
        this.getHash = this.getHash.bind(this);
        this.state = {
            fabulaDocTypes: []
        }
    }

    getHash() {
        const {formData} = this.props;
        return !formData ? 0 : hashCode(JSON.stringify(_.omit(formData.toJS(),['linked_docs'])));
    }

    componentDidMount(){
        this.curHash = this.getHash();
        const alias = 'AVAILABLE_FAB_DOC_TYPES';
        const listValueField = 'value';
        post('db/select',{alias,listValueField}).then(x=>this.setState({fabulaDocTypes:x.data}));
    }

    async reloadRow() {
        const a = this;
        const {dispatch, change, initialize, formData} = this.props;
        const alias = 'CLAIM_OUT_GET';
        const orphan = true;
        const claim_id = formData.get('id');
        const x = await post('db/select', {alias, claim_id, orphan});
        dispatch(initialize(im(x.data)));
        setTimeout(() => {
            a.curHash = a.getHash();
            a.forceUpdate();
        }, 1000);
    }

    checkIn() {
        const a = this;
        const {formData, dispatch, change, initialize} = a.props;
        const data = JSON.stringify(formData);

        const jsonMode = true;
        post('db/select', {alias, data, jsonMode,orphan:true}).then(x => { 
            const F = formData;
            const V = F ? F.values : {};
            const {error} = x.data;
            if (error) {
                throw error.split('Detail')[0];
            }

            const R = x.data;
            const id = R.claim_id || R.id || false; 
            if (!id) {
                throw 'Не удалось сохранить изменения';
            }
            dispatch(change('id', id)); //  !CASE SENSITIVE
            setTimeout(() => this.reloadRow(), 500);
        }).catch(x => {
            messageSet(x, 'error');
            console.error(x);
            a.forceUpdate();
        });
    }

    setFiles(immutableFileList) {
        const {dispatch, change} = this.props;
        dispatch(change('files', immutableFileList));
    }


    render() {
        const {formData, files, sid, dispatch, initialize,id} = this.props;
        try {
            const h = window.location.hash.split('?');
            if (h[1]=='new'){
                window.location.hash = h[0];
                setTimeout(()=>dispatch(initialize(im({}))),100);
            }
        } catch (exc) {
            //debugger;
        }//

        const noSave = !!(this.curHash && this.curHash == this.getHash())
        const stateBtnText = noSave ? 'Нет изменений' : 'Сохранить';
        const stateBtnClick = noSave ? () => {} : this.checkIn;
        const notInsert = !_.isEmpty(id);
        const P = {notInsert,reloadRow:this.reloadRow};

        return (
            <div className='ap-side-panel-wrap'>
                <Card className='ap-side-panel-left box-card sectionCard' bodyStyle={{ padding: 0 }}>
                    <Card className="box-card sectionCard" bodyStyle={{ padding: 0 }} header={
                        <div className='headline'>
                            <h3>Список подразделов</h3>
                        </div>
                    }>
                        <div className="bg-white py18">
                            <Scrollspy
                                className='ap-side-panel-left__nav'
                                items={['destinations', 'basic', 'regulations', 'links', 'ishDoc']} 
                                currentClassName='active'
                                rootEl='.ap-side-panel-content'>
                                <li href="#destinations" onClick={scrollNavi('destinations')}>Список адресатов</li>
                                <li href="#basic" onClick={scrollNavi('basic')}>Основные сведения</li>
                                <li href="#regulations" onClick={scrollNavi('regulations')}>Список постановлений</li>
                                <li href="#links" onClick={scrollNavi('links')}>Связанные обращения/письма</li>
                                <li href="#ishDoc" onClick={scrollNavi('ishDoc')}>Загруженные документы</li>
                            </Scrollspy>
                        </div>
                    </Card>
                </Card>
                <div className='ap-side-panel-content'>
                    <Card className="ap-sticky-card box-card" bodyStyle={{ padding: 0 }} header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h1 className='ap-h1 flex-parent flex-parent--center-cross'>
                                Исходящее обращение
                            </h1>
                        </div>
                    }>
                        <IshHead {...P} />
                        <IshBasic {...P} />
                        <IshLinksPost {...P} />
                        <IshLinkInner {...P} />
                        <IshLinkScan setFiles={this.setFiles} files={files} sid={sid} {...{P}} />
                    </Card>
                    <div className="ap-footer" className={`ap-footer ${noSave ? 'hidden' : ''}`}>
                        <Button disabled={noSave} type="success" size="small" plain={true} className='mr18' onClick={stateBtnClick}>{stateBtnText}</Button>
                        <Button size="small" type='text'>Отменить</Button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state);
    const formData = state.getIn(['form', 'outgoing', 'values']);
    const id = state.getIn(['form', 'outgoing', 'values','id']);
    let files = [];
    formData && (files = state.getIn(['form', 'outgoing', 'values' ,'files']));
    return {formData, files, sid, sys,id};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        //validate
    })
)(Outgoing)