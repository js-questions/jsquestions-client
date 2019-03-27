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
  checker = false;

  componentDidMount() {
    document.addEventListener('keyup', (e) => {
      this.checker = false;
    })
    document.addEventListener('keydown', (e) => {
      this.checker = true;
    })
    this.props.socket.on('editor', (data) => this.codemirror.getDoc().setValue(data.code)); // handles received text
    this.codemirror =  CodeMirror.fromTextArea(this.textArea.current, {
      mode: "javascript",
      theme: "midnight",
      lineNumbers: true,
      content: this.textArea.current,
    })
    this.codemirror.on('changes', this.codeChanged);
    this.codemirror.setOption('theme', 'material');
    this.codemirror.setSize('65vw', '80vh');
  }

  codeChanged = () => {
    if (this.checker) {
      const editorContent = this.codemirror.getDoc().getValue();
      const data = { code: editorContent, room: this.props.room } // changed property 'text' to 'code' to be more explicit
      if (editorContent !== this.state.keepChangeEditor) {
        this.props.socket.emit('editor', data);
        this.setState({keepChangeEditor: this.codemirror.getDoc().getValue()});
      }
    }
    this.codemirror.focus();
    this.codemirror.setCursor(this.codemirror.lineCount(), 0);
  }

  componentWillMount() {
    this.props.socket.removeListener('editor');
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