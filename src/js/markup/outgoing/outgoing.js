import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {reduxForm} from 'redux-form/immutable'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post} from '../../services/ajax.js'
import Immutable from 'immutable'
import {messageSet} from '../../actions/common.js'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

const im = (obj) => Immutable.fromJS(obj)

const alias = 'CLAIM_OUT_PUSH'

class Outgoing extends React.Component {

    constructor(props) {
        super(props);
        this.checkIn = this.checkIn.bind(this);
        this.reloadRow = this.reloadRow.bind(this);
    }

    async reloadRow() {
        const {dispatch, change, initialize, formData} = this.props;
        const alias = 'CLAIM_OUT_GET';
        const orphan = true;
        const claim_id = formData.get('id');
        const x = await post('db/select', {alias, claim_id, orphan});
        dispatch(initialize(im(x.data)));
    }

    checkIn() {
        const a = this;
        const {formData, dispatch, change, initialize} = a.props;
        const data = JSON.stringify(formData);

        const jsonMode = true;
        post('db/select', {alias, data, jsonMode}).then(x => {
            const F = formData;
            const V = F ? F.values : {};
            const {error} = x.data;
            if (error) {
                let exc = error.split('Detail')[0];
                throw exc;
            }

            const ID = x.data.rows[0][0].value; // the first column value of single row expected
            try {
                const R = JSON.parse(ID);
                if (R.claim_id) { /// upsert claim
                    dispatch(change('id', R.claim_id)); //  !CASE SENSITIVE
                    setTimeout(() => this.reloadRow(), 500);
                }
            } catch (exc) {
                console.error(exc);
            }
        }).catch(x => {
            messageSet(x, 'error');
            console.error(x);
            a.forceUpdate();
        });
    }

    render() {
        const {formData} = this.props;
        const id = !formData ? null : formData.get('id');
        const saveText = id ? 'Сохранить' : 'Зарегистрировать';

        return (
            <div className='ap-side-panel-wrap'>
                <div className='ap-side-panel-content'>
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                            <Card className="box-card mb60" header={
                                <h3 className='ap-h3'>
                                    Новое исходящее обращение
                                </h3>
                            }>
                                <IshHead/>
                                <IshBasic/>
                                <IshLinksPost/>
                                <IshLinkInner reloadRow={this.reloadRow}/>
                                <IshLinkScan/>
                            </Card>

                            <div className="ap-footer">
                                <Button type="success" size="small" plain={true} className='mr18' onClick={this.checkIn}>{saveText}</Button>
                                <Button size="small" type='text'>Отменить</Button>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let formData = state.getIn(['form', 'outgoing', 'values']);
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