import React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'

import IncLetterHead from './sub/incLetterHead.js'
import IncLetterBasic from './sub/incLetterBasic.js'
import IncLetterPlus from './sub/incLetterPlus.js'
import IncLetterPost from './sub/incLetterPost.js'
import IncLetterIspoln from './sub/incLetterIspoln.js'
import IncLinkInner from './sub/incLinksInner.js'
import IncLinkScan from './sub/incLinksScan.js'

export default class IncomingLetter extends React.Component {

  render() {  
  	return(
  		<div style={{display:'flex','flex-wrap':'wrap'}}>
        <IncLetterHead/>
        <IncLetterBasic/>
        <IncLetterPlus/>
        <IncLetterPost/>
        <IncLetterIspoln/>
        <IncLinkInner />
        <IncLinkScan />
  		</div>
  	);
  } //
}

/*
export default connect((state) => {
    debugger;
    return {};
})(IncomingLetter);*/