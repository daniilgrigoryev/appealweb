import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {reduxForm} from 'redux-form/immutable'

import {Button, Card, Layout} from 'element-react'

import BasicData from './appealContent/basicData.js'
import ClaimantData from './appealContent/claimantData.js'
import OrganizationsData from './appealContent/organizationsData.js'
import SummaryData from './appealContent/summaryData.js'
import TopicsData from './appealContent/topicsData.js'
import IshDocsData from './appealContent/ishDocsData.js'
import ArchiveData from './appealContent/archiveData.js'

import {exportString} from '../../services/stringExporter.js'
import {push} from '../../services/api.js'


class FullAppeal extends React.Component {

    constructor(props) {
        super(props);
        this.outCsv = this.outCsv.bind(this);
        this.pushCsv = this.pushCsv.bind(this);
    }

    outCsv() {
        const {content, id} = this.props;
        exportString('Обращение ' + id, JSON.stringify(content));
    }

    pushCsv() {
        const {content, id} = this.props;
        push(-1, 'CLAIM_PUSH', content, true)
    }

    render() {
        const p = this.props;
        return (
            <div className='mb60'>
                <Layout.Row gutter="12">
                    <Layout.Col lg="9" sm='24'>
                        <BasicData         {...p} />
                        <div className='mt12'>
                            <ClaimantData      {...p} />
                        </div>
                    </Layout.Col>

                    <Layout.Col lg="15" sm='24'>
                        <OrganizationsData {...p} />

                        <div className='mt12'>
                            <SummaryData       {...p} />
                        </div>

                        <div className='mt12'>
                            <TopicsData        {...p} />
                        </div>

                        <div className='mt12'>
                            <IshDocsData       {...p} />
                        </div>

                        <div className='mt12'>
                            <ArchiveData       {...p} />
                        </div>
                    </Layout.Col>
                </Layout.Row>

                <div className="ap-footer">
                    <Button onClick={this.outCsv}>Выгрузить CSV</Button>
                    <Button onClick={this.pushCsv}>На сервер CSV</Button>
                </div>
            </div>
        );
    }//
}

const mapStateToProps = (state) => {
    const V = state.getIn(['form', 'appeal', 'values']);
    return {
        disabled: true,
        system: state.getIn(['general', 'system']),
        content: V ? V.toJS() : {}
    };
};

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
    })
)(FullAppeal)


/*
var js2pg = {
    'string':'text',
    'object':'jsonb',
    'boolean':'boolean',
    'number':'numeric'
}

_.chain(A).keys().map(fld=>{
    const typ = js2pg[typeof A[fld]];
    return {fld,typ}
}).map(x=>'"'+x.fld+'" ' +x.typ).join(',\n').value()
*/