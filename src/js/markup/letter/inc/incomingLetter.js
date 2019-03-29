import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'

import IncLetterHead from './sub/incLetterHead.js'
import IncLetterBasic from './sub/incLetterBasic.js'
import IncLetterPlus from './sub/incLetterPlus.js'
import IncLetterPost from './sub/incLetterPost.js'
import IncLetterIspoln from './sub/incLetterIspoln.js'
import IncLinkInner from './sub/incLinksInner.js'
import IncLinkScan from './sub/incLinksScan.js'

import {reduxForm} from 'redux-form/immutable'

import {post} from '../../../services/ajax.js'

const alias = "INC_LETTER_PUSH"

class IncomingLetter extends React.Component {

    constructor(props) {
        super(props)
        this.register = this.register.bind(this)
    }

    register(){
        const a = this;

        const {formData,dispatch,change} = a.props;
        const data = JSON.stringify(Object.assign({},formData.values));
        const jsonMode = true;

        post('db/push', {alias,data,jsonMode}).then(x => {
        }).catch(x=>{
            dispatch(messageSet(x,'error'));
            console.error(x);
            a.forceUpdate();
        });  

    }

    render() {
        return (
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card mb60" header={
                        <h3 className='ap-h3'>
                            Новое входящее служебное письмо
                        </h3>
                    }>
                        <IncLetterHead/>
                        <IncLetterBasic/>
                        <IncLetterPlus/>
                        <IncLetterPost/>
                        <IncLetterIspoln/>
                        <IncLinkInner/>
                        <IncLinkScan/>
                    </Card>
                    <div className="ap-footer">
                    <Button className='mr24' onClick={this.register}>Зарегистрировать</Button>
                    </div>
                </Layout.Col>
            </Layout.Row>
        );//
    }
}

const mapStateToProps = (state) => {
    let formData = state.getIn(['form','letter_incoming']);
    formData && (formData = formData.toJS());
    return {formData};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'letter_incoming', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    })
)(IncomingLetter)