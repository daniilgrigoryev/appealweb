import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {reduxForm} from 'redux-form/immutable'
import { connect } from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post} from '../../services/ajax.js'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

const alias = 'CLAIM_OUT_PUSH'

class Outgoing extends React.Component {

    constructor(props) {
        super(props);
        this.checkIn = this.checkIn.bind(this);
    }

    checkIn() {
        const a = this;
        const {form,dispatch,change} = a.props;
        const data = JSON.stringify(Object.assign({},form.values));
        
        const jsonMode = true;
        post('rest/push',{alias,data,jsonMode}).then(x=>{
            const ID = x.data.rows[0][0].value; // the first column value of single row expected
            dispatch(change('ID',ID)); //  !CASE SENSITIVE
        }).catch(x=>{
            a.forceUpdate();
        });  
    }
    

  render() {  
    return(
        <Layout.Row gutter="20">
            <Layout.Col span="24">
                <Card className="box-card mb60" header={
                    <h3 className='ap-h3'>
                        Новое исходящее обращение
                    </h3>
                }>
                    <IshHead />
                    <IshBasic />
                    <IshLinksPost />
                    <IshLinkInner />
                    <IshLinkScan />
                </Card>

                <div className="ap-footer">
                    <Button className='mr24' onClick = {this.checkIn}>Зарегистрировать</Button>
                    <Button type='text'>Отменить</Button>
                </div>
            </Layout.Col>
        </Layout.Row>
    );
  }
}

const mapStateToProps = (state)=>{
    let form = state.getIn(['form','outgoing']);
    form && (form = form.toJS());
    return {form};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(Outgoing)