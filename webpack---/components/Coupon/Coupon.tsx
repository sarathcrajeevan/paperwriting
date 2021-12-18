import React from 'react';
import CouponDivider from '../../v1/icons/dist/components/couponDivider'; // TODO icons still from v1
import CouponButton from '../../components/Coupon/CouponButton';
import { Message } from '@wix/chat-sdk';
import TitleBubble from '../TitleBubble/TitleBubble';
import styles from './Coupon.scss';
import { withLockedTranslation } from '../../hooks/utils';
import { withEditorSettings } from '../../hooks/editor-settings';
import { EditorSettings } from '@wix/inbox-common';
import { Services, withServices } from '../../hooks/services-registry';
import { Theme, withTheme } from '../../hooks/theme';

interface CouponStateProps {
  primaryColor: any;
  textColor: any;
  buttonTextColor: any;
  selectedRadiusOption: any;
  fontFamily: string;
}

interface CouponProps extends CouponStateProps, Services {
  headerTitle: string;
  headerSubtitle: string;
  text: string;
  title?: string;
  message: Message;
}

interface CouponState {
  didCopied: boolean;
}

class Coupon extends React.Component<CouponProps, CouponState> {
  constructor(props) {
    super(props);
    this.state = {
      didCopied: false,
    };
  }

  handleCopy = () => {
    this.setState({ didCopied: true });
    this.props.biLogger.copyCouponCode();
    setTimeout(() => {
      this.setState({ didCopied: false });
    }, 4000);
  };

  render() {
    const {
      primaryColor,
      textColor,
      headerTitle,
      headerSubtitle,
      text,
      fontFamily,
      message,
      title,
    } = this.props;
    const _selectedRadiusOption = this.props.selectedRadiusOption;

    const headerContainerAddedStyle = {
      background: primaryColor,
      borderRadius: `${_selectedRadiusOption}px ${_selectedRadiusOption}px 0 0`,
      marginBottom: '-1px',
    };
    const textContainerAddedStyle = {
      background: primaryColor,
      borderRadius: `0 0 ${_selectedRadiusOption}px ${_selectedRadiusOption}px`,
      marginTop: '-1px',
    };
    const buttonAddedStyle = {
      color: this.props.buttonTextColor,
      background: textColor,
      borderRadius: `${_selectedRadiusOption}px`,
    };

    return (
      <div>
        <TitleBubble message={message} title={title} />
        <div
          data-hook="coupon"
          className={styles.couponContainer}
          style={{ color: textColor, fontFamily }}
        >
          <div
            data-hook="coupon-header-container"
            className={styles.couponContainer}
            style={headerContainerAddedStyle}
          >
            <div data-hook="coupon-header" className={styles.headerTitle}>
              {headerTitle}
            </div>
            <div
              data-hook="coupon-header-subtitle"
              className={styles.headerSubtitle}
            >
              {headerSubtitle}
            </div>
          </div>
          <CouponDivider color={primaryColor} width="220px" height="19px" />
          <div
            data-hook="coupon-text-container"
            className={styles.couponContainer}
            style={textContainerAddedStyle}
          >
            <div data-hook="coupon-text" className={styles.couponText}>
              {text}
            </div>
            <CouponButton
              text={text}
              onHandleCopy={this.handleCopy}
              buttonAddedStyle={buttonAddedStyle}
              didCopied={this.state.didCopied}
            />
          </div>
        </div>
      </div>
    );
  }
}

const CouponWrapper: React.FC<CouponProps & EditorSettings & Theme> = ({
  styleParams,
  chatWeb,
  publicData,
  ...props
}) => (
  <Coupon
    {...props}
    primaryColor={styleParams?.colors?.yourMessageBackgroundColor?.value}
    textColor={styleParams?.colors?.yourMessageFontColor?.value}
    buttonTextColor={chatWeb?.room?.button.textColor}
    selectedRadiusOption={publicData?.design?.selectedRadiusOption}
  />
);

export default withServices(
  withTheme(withEditorSettings(withLockedTranslation(CouponWrapper))),
);
