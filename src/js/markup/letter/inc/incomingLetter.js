import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {getSessionId, getSystem} from '../../../selectors/common.js'
import IncLetterHead from './sub/incLetterHead.js'
import IncLetterBasic from './sub/incLetterBasic.js'
import IncLetterPlus from './sub/incLetterPlus.js'
import IncLetterPost from './sub/incLetterPost.js'
import IncLetterIspoln from './sub/incLetterIspoln.js'
import IncLinkInner from './sub/incLinksInner.js'
import IncLinkScan from './sub/incLinksScan.js'
import Immutable from 'immutable'
import {messageSet} from '../../../actions/common.js'

import {reduxForm} from 'redux-form/immutable'

import {post} from '../../../services/ajax.js'

const alias = "INC_LETTER_PUSH"

const hashCode = (s) => (s || '').split('').reduce((hash, val) => (((hash << 5) - hash) + val.charCodeAt(0)) | 0, 0);

const im = (obj) => Immutable.fromJS(obj)

class IncomingLetter extends React.Component {

    constructor(props) {
        super(props)
        this.setFiles = this.setFiles.bind(this);
        this.register = this.register.bind(this);
        this.curHash = 0;
        this.getHash = this.getHash.bind(this);
    }

    componentDidMount() {
        this.curHash = this.getHash();
    }

    getHash() {
        debugger;
        const {formData} = this.props;
        return !formData ? 0 : hashCode(JSON.stringify(_.omit(formData.toJS(),['linked_docs'])));
    }

    register(){
        const a = this;
        const {formData,dispatch,change,initialize} = a.props;
        const data = JSON.stringify(formData);
        const jsonMode = true;
        const orphan = true;
   
        post('db/select', {alias,data,jsonMode,orphan}).then(x => {    
            if (x.data && !x.data.error) {
                dispatch(initialize(im(x.data)));
                setTimeout(() => {
                     a.curHash = a.getHash();
                    a.forceUpdate();
                }, 1000);
            }
        }).catch(x=>{
            messageSet(x,'error');
            console.error(x);
            a.forceUpdate();
        });  

    }

    setFiles(immutableFileList) {
        const {dispatch, change} = this.props;
        dispatch(change('files', immutableFileList));
    }

    render() {
        const {files, sid, dispatch, initialize} = this.props;

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
        const stateBtnClick = noSave ? () => {} : this.register;

        return (
            <div className='ap-side-panel-wrap'>
                <div className='ap-side-panel-content'>
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                            <Card className="box-card mb60" header={
                                <h3 className='ap-h3' onClick={this.register} >
                                    Новое входящее служебное письмо
                                </h3>
                            }>
                                <IncLetterHead/>
                                <IncLetterBasic/>
                                <IncLetterPlus/>
                                <IncLetterPost/>
                                <IncLetterIspoln/>
                                <IncLinkInner/>
                                <IncLinkScan files={files} setFiles={this.setFiles} sid={sid}/>
                            </Card>
                            <div className="ap-footer" className={`ap-footer ${noSave ? 'hidden' : ''}`}>
                                <Button type="success" size="small" plain={true} className='mr18' onClick={stateBtnClick}>{stateBtnText}</Button>
                                <Button size="small" type='text'>Отменить</Button>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                </div>
            </div>
        );
    } //
}

const mapStateToProps = (state) => {
    const sid = getSessionId(state);
    const formData = state.getIn(['form','letter_incoming','values']);
    let files;
    formData && (files = state.getIn(['form', 'letter_incoming', 'values' ,'files']));
    return {formData, files, sid};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'letter_incoming', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    })
)(IncomingLetter)