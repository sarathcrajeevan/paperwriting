import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { InjectedTranslateProps, translate } from 'react-i18next';
import Verification from './Verification';
import styles from './CouponButton.scss';

interface CouponButtonProps extends InjectedTranslateProps {
  text: string;
  buttonAddedStyle: any;
  didCopied: boolean;
  onHandleCopy(): any;
}

class CouponButton extends React.Component<CouponButtonProps> {
  render() {
    const { text, buttonAddedStyle, didCopied, onHandleCopy, t } = this.props;
    return (
      <CopyToClipboard text={text}>
        <button
          data-hook="copy-code-button"
          className={styles.submit}
          style={buttonAddedStyle}
          onClick={onHandleCopy}
        >
          {didCopied ? this.renderTextCopied() : t('coupon.copy-code-button')}
        </button>
      </CopyToClipboard>
    );
  }

  renderTextCopied() {
    return (
      <div data-hook="code-copied-container">
        <span>{this.props.t('coupon.copy-code-button-clicked')}</span>
        <span>
          <Verification width="16px" height="16px" />
        </span>
      </div>
    );
  }
}

export default translate()(CouponButton);
