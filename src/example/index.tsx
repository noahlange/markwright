import React from 'react';
import { render } from 'react-dom';
import Markwright from '../markwright';
import content from './readme';
import styles from './styles';

export default class Test extends React.Component<any, any> {
  public state = {
    content
  };

  public onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [k]: e.target.value });
  };

  public render() {
    return (
      <>
        <style type="text/css">
          {styles(
            {
              columns: 1,
              manual: true
            },
            8.5,
            11
          )}
        </style>
        <Markwright value={this.state.content} config={{ columns: 1 }} />
        {/* <div id="editor">
          <div>
            <h1>markwright</h1>
            <p>
              <strong>Markwright</strong> is a single-dependency, React-powered
              typesetter for Markdown featuring dynamic document flow,
              automagical footnotes, section tracking and <s>a variety of</s> no
              other features. While it's <em>absolutely</em> not a replacement
              for more robust typesetting software (e.g., LaTeX), it's easy to
              use and will work in a pinch for some quick-and-dirty PDF-able
              document layouts featuring Markdown content.
            </p>
            <p>
              Edit the text area below to dynamically update the contents and
              layout of the README to the left.
            </p>
          </div>
          <div id="editors">
            <textarea
              value={this.state.content}
              onChange={this.onChange('content')}
            />
          </div>
        </div> */}
      </>
    );
  }
}

render(<Test />, document.getElementById('react-root'));
