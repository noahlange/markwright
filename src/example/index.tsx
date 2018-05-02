import * as React from 'react';
import { render } from 'react-dom';
import Markwright from '../markwright';
import { content } from './readme';

export default class Test extends React.Component<any, any> {
  public state = {
    content
  };

  public onChange = e => {
    this.setState({ content: e.target.value });
  };

  public render() {
    return (
      <>
        <Markwright value={this.state.content} config={{ columns: 2 }} />
        <div id="editor">
          <div>
            <h1>markwright</h1>
            <p>
              <strong>Markwright</strong> is a single-dependency, React-powered
              typesetter for Markdown featuring dynamic document flow,
              automagical footnotes, section tracking and a variety of other
              features. While it's <em>absolutely</em> not a replacement for
              more robust typesetting software (e.g., LaTeX), it's easy to use
              and will work in a pinch for some quick-and-dirty PDF-able\
              document layouts featuring Markdown content.
            </p>
            <p>
              Edit the text area below to dynamically update the content and
              layout of the README to the left.
            </p>
          </div>
          <textarea value={this.state.content} onChange={this.onChange} />
        </div>
      </>
    );
  }
}

render(<Test />, document.getElementById('react-root'));
