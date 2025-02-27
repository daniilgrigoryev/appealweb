import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'

import OutLetterHead from './sub/outLetterHead.js'
import OutLetterBasic from './sub/outLetterBasic.js'

import OutLetterPost from './sub/outLetterPost.js'
import OutLetterIspoln from './sub/outLetterIspoln.js'
import OutLinkInner from './sub/outLinksInner.js'
import OutLinkScan from './sub/outLinksScan.js'

import {reduxForm} from 'redux-form/immutable'

import {post} from '../../../services/ajax.js'

const alias = "OUT_LETTER_PUSH"

class OutcomingLetter extends React.Component {

    constructor(props) {
        super(props)
        this.register = this.register.bind(this)
    }

    register(){
        const a = this;

        const {formData,dispatch,change} = a.props;
        const data = JSON.stringify(Object.assign({},formData.toJS().values));
        const jsonMode = true;
        post('db/select', {alias,data,jsonMode}).then(x => {
            
        }).catch(x=>{
            messageSet(x,'error');
            console.error(x);
            a.forceUpdate();
        });  

    }

    render() {
        return (
            <div className='ap-side-panel-wrap'>
                <div className='ap-side-panel-content'>
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                            <Card className="box-card mb60" header={
                                <h3 className='ap-h3' onClick={this.register} >
                                    Новое исходящее служебное письмо
                                </h3>
                            }>
                                <OutLetterHead/>
                                <OutLetterBasic/>
                                <OutLetterPost/>
                                <OutLetterIspoln/>
                                <OutLinkInner/>
                                <OutLinkScan/>
                            </Card>
                        </Layout.Col>
                    </Layout.Row>
                </div>
            </div>
        )
    } //
}

const mapStateToProps = (state) => {
    const formData = state.getIn(['form','letter_outcoming']);
    return {formData};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'letter_outcoming', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    })
)(OutcomingLetter)
