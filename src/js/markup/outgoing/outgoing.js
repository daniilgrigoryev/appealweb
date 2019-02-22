import React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'

import IshHead from './subForms/ishHead.js'
import IshBasic from './subForms/ishBasic.js'
import IshLinksPost from './subForms/ishLinksPost.js'
import IshLinkInner from './subForms/ishLinksInner.js'
import IshLinkScan from './subForms/ishLinksScan.js'

export default class Outgoing extends React.Component {

  render() {  
  	return(
  		<div>
  			<IshHead />
  			<IshBasic />
  			<IshLinksPost />
  			<IshLinkInner />
  			<IshLinkScan />
  		</div>
  	);
  } //
}

/*
export default connect((state) => {
    debugger;
    return {};
})(Outgoing);*/