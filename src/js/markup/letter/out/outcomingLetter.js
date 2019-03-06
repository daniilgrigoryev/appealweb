import React from 'react'
import * as _ from 'lodash'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'

import OutLetterHead from './sub/outLetterHead.js'
import OutLetterBasic from './sub/outLetterBasic.js'

import OutLetterPost from './sub/outLetterPost.js'
import OutLetterIspoln from './sub/outLetterIspoln.js'
import OutLinkInner from './sub/outLinksInner.js'
import OutLinkScan from './sub/outLinksScan.js'


export default class OutcomingLetter extends React.Component {

    render() {
        return (
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card mb60" header={
                        <h3 className='ap-h3'>
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
        )
    }
}
