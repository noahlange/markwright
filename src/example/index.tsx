import React from 'react';
import { render } from 'react-dom';
import Markwright from '../markwright';
import content from './readme';
import styles from './styles';
import PanZoom from './zoom';

export default class Test extends React.Component<any, any> {
  public state = {
    content,
    scale: 1
  };

  public onZoom = (scale: number) => {
    this.setState({ scale });
  };

  public onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [k]: e.target.value });
  };

  public render() {
    const t = this.state.scale;
    const height = t <= 1 ? window.innerHeight / t : t * window.innerHeight;
    const width = t <= 1 ? window.innerWidth / t : t * window.innerWidth;
    return (
      <div>
        <style type="text/css">
          {styles(
            {
              columns: 1,
              manual: false
            },
            8.5,
            11
          )}
        </style>
        <PanZoom onTransform={this.onZoom}>
          <Markwright
            context={{ author: { name: 'Noah Lange' } }}
            config={{ columns: 1, manual: false }}
            container={{ height, width }}
            value={this.state.content}
          />
        </PanZoom>
      </div>
    );
  }
}

render(<Test />, document.getElementById('react-root'));
