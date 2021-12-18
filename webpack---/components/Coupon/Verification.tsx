/* eslint-disable */
/* tslint:disable */
import React from 'react';
import styles from './CouponButton.scss';
export interface verificationProps extends React.SVGAttributes<SVGElement> {
  size?: string;
}
const verification: React.FunctionComponent<verificationProps> = ({size, ...props}) => (
  <svg style={{verticalAlign:'sub', marginLeft: '6px'}} fill="currentColor" width={ size || "1em" } height={ size || "1em" } viewBox="0 0 18 18" {...props}>
    <g transform="translate(1 1)" stroke="currentColor" fill="none" fillRule="evenodd">
      <path className={styles.verification} d="M5 8.21l2.439 2.384L11 5" />
      <circle cx="8" cy="8" r="8" />
    </g>
  </svg>
);
export default verification;
/* tslint:enable */
/* eslint-enable */
