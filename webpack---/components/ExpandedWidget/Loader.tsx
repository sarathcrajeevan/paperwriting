import React from 'react';
import styles from './Loader.scss';

export const Loader = () => {
  const color = '#8894ab';
  const backgroundColor = '#ffffff';

  return (
    <div
      data-hook="loader"
      className={styles.loader}
      style={{
        backgroundColor,
      }}
    >
      <svg className={styles.spinner} viewBox="0 0 50 50">
        <circle
          className={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="2"
          stroke={color}
        ></circle>
      </svg>
    </div>
  );
};
