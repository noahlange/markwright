import * as React from 'react';
import { render } from 'react-dom';
import Markwright from '../markwright';
import { content, two } from './readme';

export default class Test extends React.Component<any, any> {
  public state = {
    content,
    tab: 0
  };

  public onChange = e => {
    this.setState({ content: e.target.value });
  }

  public render() {
    const texts = [ content ];
    const setTab = n => e => this.setState({ tab: n, content: texts[n] });
    const tabIs = n => this.state.tab === n ? 'active' : '';
    return (
      <>
        <Markwright content={this.state.content} />
        <div id="editor">
          <div>
            <h1>markwright</h1>
            <p><strong>Markwright</strong> is a React-powered typesetter for
            Markdown featuring dynamic document flow, automagical footnotes,
            section tracking and a variety of other features. While it's not a
            replacement for more robust typesetting software (e.g., LaTeX), it's
            easy to use and will work in a pinch for some quick-and-dirty
            PDF-able document layouts featuring Markdown content.</p>
            <p>Edit the text area below to dynamically update the content and
              layout of the README to the left.</p>
          </div>
          <div className="tabs">
            <a onClick={ setTab(0) } className={ tabIs(0) }>Readme</a>
            {/* <a onClick={ setTab(1) } className={ tabIs(1) }>Markdown</a> */}
            {/* <a onClick={ setTab(2) } className={ tabIs(2) }>Markdown</a> */}
          </div>
          <textarea
            value={this.state.content}
            onChange={this.onChange}
          />
        </div>
      </>
    );
  }
}

render(<Test />, document.getElementById('react-root'));
