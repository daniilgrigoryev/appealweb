import React from 'react'
import * as _ from 'lodash'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'

import IncLetterHead from './sub/incLetterHead.js'
import IncLetterBasic from './sub/incLetterBasic.js'
import IncLetterPlus from './sub/incLetterPlus.js'
import IncLetterPost from './sub/incLetterPost.js'
import IncLetterIspoln from './sub/incLetterIspoln.js'
import IncLinkInner from './sub/incLinksInner.js'
import IncLinkScan from './sub/incLinksScan.js'

export default class IncomingLetter extends React.Component {

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
                </Layout.Col>
            </Layout.Row>
        );
    }
}
