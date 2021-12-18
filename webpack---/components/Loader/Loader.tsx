import React from 'react';
import styles from './Loader.scss';

export interface LoaderProps {
  dimensions?: number;
  borderWidth?: number;
  color?: string;
}

export class Loader extends React.Component<LoaderProps> {
  render() {
    const dimensions = this.props.dimensions && 20;
    const borderWidth = this.props.borderWidth && 2;
    const style: any = {
      height: `${dimensions}px`,
      width: `${dimensions}px`,
      borderWidth: `${borderWidth}px`,
    };
    if (this.props.color) {
      style.color = this.props.color;
    } else {
      style.opacity = 0.25;
    }

    return (
      <div data-hook="loader" className={styles.loader} style={{ ...style }} />
    );
  }
}
