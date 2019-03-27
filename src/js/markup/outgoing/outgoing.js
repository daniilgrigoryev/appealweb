import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {reduxForm} from 'redux-form/immutable'
import { connect } from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post} from '../../services/ajax.js'
import Immutable from 'immutable'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

const im = (obj)=> Immutable.fromJS(obj)

const alias = 'CLAIM_OUT_PUSH'

class Outgoing extends React.Component {

    constructor(props) {
        super(props);
        this.checkIn = this.checkIn.bind(this);
    }

    checkIn() {
        const a = this;
        const {formData,dispatch,change,initialize} = a.props;
        const data = JSON.stringify(Object.assign({},formData.values));
        
        const jsonMode = true;
        post('rest/push',{alias,data,jsonMode}).then(x=>{
            const F = formData;
            const V = F ? F.values : {};
            const {error} = x.data;
            if (error){
              let exc = error.split('Detail')[0];
              throw exc;
            }
            const ID = x.data.rows[0][0].value; // the first column value of single row expected
            try {
                const R = JSON.parse(ID);
                if (R.claim_id){ /// upsert claim  
                    dispatch(change('id',R.claim_id)); //  !CASE SENSITIVE
                }
                if (R.posts) {
                    const p_ids = R.posts || [];
                    const p = _.map(V.posts, function (x, i) {
                            return x.id = p_ids[i], x;
                        });
                    dispatch(change('posts',im(p)));
                }
                if (R.addr) {
                    const ad_ids = R.addr || [];
                    const ad = _.map(V.addressee, function (x, i) {
                            return x.id = ad_ids[i], x;
                        }); 
                    dispatch(change('addressee',im(ad)));
                }
            }
            catch (exc){
              console.error(exc);
            } 
            
        }).catch(x=>{
            dispatch(messageSet(x,'error'));
            console.error(x);
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
    let formData = state.getIn(['form','outgoing']);
    formData && (formData = formData.toJS());
    return {formData};
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