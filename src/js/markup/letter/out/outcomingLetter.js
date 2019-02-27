import React from 'react'
import * as _ from 'lodash'
import { connect } from 'react-redux'

import OutLetterHead from './sub/outLetterHead.js'
import OutLetterBasic from './sub/outLetterBasic.js'

import OutLetterPost from './sub/outLetterPost.js'
import OutLetterIspoln from './sub/outLetterIspoln.js'
import OutLinkInner from './sub/outLinksInner.js'
import OutLinkScan from './sub/outLinksScan.js'


export default class IncomingLetter extends React.Component {

  render() {  
  	return(
  		<div style={{display:'flex','flex-wrap':'wrap'}}>
        <OutLetterHead/>
        <OutLetterBasic/>

        <OutLetterPost/>
        <OutLetterIspoln/>
        <OutLinkInner />
        <OutLinkScan />
  		</div>
  	);
  } //
}

/*
export default connect((state) => {
    debugger;
    return {};
})(IncomingLetter);*/