import  '../../../../scss/docPreview.scss'
import React from 'react'
import {Dialog,Button} from 'element-react'
import { connect } from 'react-redux'

export default class DocPreview extends React.Component {

  constructor(props) {
    super(props);
    const P = this.props;
    this.closePreview = P.closePreview.bind(this);
    this.downloadDoc = P.downloadDoc.bind(this);
    this.downloadPdf = P.downloadPdf.bind(this);
  }

  render() {
    return (
            <div class = 'formXZV'>
              <div class='docWrap'>
                <div><embed src={this.props.document} type="application/pdf" width="1685" height="785"/></div>   
                </div>
                <div class= 'buttons'>
                  <button type="button" onClick={this.downloadDoc}  >docx</button>
                  <button type="button" onClick={this.downloadPdf}  >pdf</button>
                  <button type="button" onClick={this.closePreview}>Закрыть</button>
                </div>
              </div>
            );
  } //
}
