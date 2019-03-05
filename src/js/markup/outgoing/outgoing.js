import React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

export default class Outgoing extends React.Component {

  render() {  
  	return(
        <Layout.Row gutter="20">
            <Layout.Col span="24">
                <Card className="box-card mb60" header={
                    <h3 className='ap-h3'>
                        Новое исходящее сообщение
                    </h3>
                }>
                    <IshHead />
                    <IshBasic />
                    <IshLinksPost />
                    <IshLinkInner />
                    <IshLinkScan />
                </Card>

                <div className="ap-footer">
                    <Button size='small' type='primary' className='mr24'>Зарегистрировать</Button>
                    <Button size='small' type='text'>Отменить</Button>
                </div>
            </Layout.Col>
        </Layout.Row>
	);
  }
}
