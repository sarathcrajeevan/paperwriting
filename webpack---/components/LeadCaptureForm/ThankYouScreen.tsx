import React from 'react';
import { Constants } from '@wix/chat-sdk';
import classNames from 'classnames';
import { MessageEntry } from '@wix/chat-web';
import styles from './LeadCaptureForm.scss';
import { ReactComponent as CheckSuccess } from 'wix-ui-tpa/dist/src/assets/icons/CheckSuccess.svg';

interface ThankYouScreenProps {
  groupPosition: 'start' | 'end' | 'middle' | 'single';
  thankYouMessage: string;
  narrowStyle: boolean;
  title?: string;
}

class ThankYouScreen extends React.Component<ThankYouScreenProps> {
  render() {
    const { thankYouMessage, groupPosition, narrowStyle, title } = this.props;
    return (
      <div className={styles.entry}>
        <MessageEntry
          title={title}
          separateTitle={false}
          groupPosition={groupPosition}
          position={Constants.MessageDirections.Incoming}
        >
          <div
            data-hook="lcf-thank-you"
            className={classNames({
              [styles.thankYouContainer]: true,
              [styles.narrowStyle]: narrowStyle,
            })}
          >
            <div className={styles.iconV}>
              <CheckSuccess style={{ fill: 'currentColor' }} />
            </div>
            <div
              data-hook="lcf-thank-you-text"
              className={styles.thankYouMessage}
            >
              {thankYouMessage}
            </div>
          </div>
        </MessageEntry>
      </div>
    );
  }
}

export default ThankYouScreen;
