import { clamp } from 'lodash';
import React, { WheelEvent } from 'react';

function getScaleMultiplier(delta: number) {
  const speed = 0.065;
  let scaleMultiplier = 1;
  if (delta > 0) {
    // zoom out
    scaleMultiplier = 1 - speed;
  } else if (delta < 0) {
    // zoom in
    scaleMultiplier = 1 + speed;
  }
  return scaleMultiplier;
}

type ZoomHandler = (z: number) => void;

export default class extends React.Component<{ onTransform: ZoomHandler }> {
  public state = {
    scale: 1
  };

  public onScroll = (e: WheelEvent<HTMLDivElement>) => {
    if (e.altKey) {
      const scale = clamp(
        this.state.scale * getScaleMultiplier(e.deltaY),
        0.1,
        1.5
      );
      this.setState({ scale }, () => this.props.onTransform(scale));
      e.preventDefault();
    }
  };

  public render() {
    return (
      <div onWheel={this.onScroll}>
        <div
          style={{
            transform: `scale(${this.state.scale})`,
            transformOrigin: 'top center'
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
