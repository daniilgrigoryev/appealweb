import React, {Component,PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import {Field} from 'redux-form';

class EFileInput extends Component {

    constructor(props) {
        super(props);
        this.handleFile = this.handleFile.bind(this);
    }

    handleFile(evt) {
      debugger;
        var files = evt.target.files;
        var f = files[0];
        if (!f){
          console.err('no file found')
          return;
        }
        
        const reader = new FileReader(); // чтение файла в браузере без загрузки на сервер
        reader.onload = (e)=>{
          const blobBuf = e.target.result; // new Blob([new Uint8Array(data)]);
          const blob = new Blob([new Uint8Array(blobBuf)]);
          debugger;
        };
        reader.readAsArrayBuffer(f); // старт чтения, в коллбеке base64 строка
    }


    render() {
        return (
          <input type="file" onChange={this.handleFile} /> 
        );
    } //
}

const FFileInput = props => <Field {...props} component={EFileInput} />;

export {EFileInput,FFileInput};