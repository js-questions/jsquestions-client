import React, { Component } from 'react';
import './chat.scss';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class CodeEditor extends Component {

  state = {
    keepChangeEditor: ''
  }

  textArea = React.createRef();

  componentDidMount() {
    this.codemirror =  CodeMirror.fromTextArea(this.textArea.current, {
      mode: "javascript",
      theme: "default",
      lineNumbers: true,
      content: this.textArea.current,
    })

    this.codemirror.setSize(null, '79.8vh');
    this.codemirror.on('change', this.codeChanged);
    this.props.socket.on('editor', (data) => this.codemirror.getDoc().setValue(data.code)); // handles received text
  }

  codeChanged = () => {
    const editorContent = this.codemirror.getDoc().getValue();
    console.log('editorContent', editorContent) // OMG: undefined for learner
    const data = { code: editorContent, room: this.props.room } // changed property 'text' to 'code' to be more explicit
    if (editorContent !== this.state.keepChangeEditor) {
      this.props.socket.emit('editor', data);
      this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()});
    }
    this.codemirror.focus();
    this.codemirror.setCursor(this.codemirror.lineCount(), 0);
  }

  render() {
    return(
      <div className="editor">
        <textarea id="txtArea" name="txtArea"ref={this.textArea}/>
      </div>

    )
  }

}

export default CodeEditor;