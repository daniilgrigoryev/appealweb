import React from 'react'
import * as _ from 'lodash'
import {compose} from 'redux'
import { connect } from 'react-redux'
import {reset} from 'redux-form';
import {Field, reduxForm} from 'redux-form/immutable'
import {Button, Input, Card, Layout} from 'element-react'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

import {exportString} from '../../services/stringExporter.js'

class Outgoing extends React.Component {

    constructor(props) {
        super(props);
        this.outCsv = this.outCsv.bind(this);
    }

    outCsv() {
        const {formData, id} = this.props;
        exportString('Обращение ' + id, JSON.stringify(formData));
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
                         <Button onClick={this.outCsv}>Выгрузить JSON</Button>
                        <Button className='mr24'>Зарегистрировать</Button>
                        <Button type='text'>Отменить</Button>
                    </div>
                </Layout.Col>
            </Layout.Row>
    	);
    } //
}


const mapStateToProps = (state,props)=>{
    let formData = state.getIn(['form','outgoing', 'values']);
    formData && (formData = formData.toJS());
    return {formData};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(Outgoing)