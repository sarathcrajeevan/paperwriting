import React from 'react';
import styles from './Payment.scss';
import { Loader } from '../Loader/Loader';
import IconV from '../../v1/icons/dist/components/iconV'; // TODO icons still from v1
import { Message } from '@wix/chat-sdk';
import TitleBubble from '../TitleBubble/TitleBubble';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { ServerApi } from '../../services/server-api';
import { withEditorSettings } from '../../hooks/editor-settings';
import { AppState, withAppState } from '../../hooks/app-state';
import { Services, withServices } from '../../hooks/services-registry';
import { EditorSettings } from '@wix/inbox-common';
import { withLockedTranslation } from '../../hooks/utils';
import { Theme, withTheme } from '../../hooks/theme';

interface PaymentRequestStateProps {
  primaryColor: string;
  textColor: string;
  buttonTextColor: string;
  fontFamily: string;
  selectedRadiusOption: any;
  isPrimaryLanguage: boolean;
  locale: string | undefined;
  serverApi: ServerApi;
}

interface PaymentRequestProps
  extends InjectedTranslateProps,
    PaymentRequestStateProps {
  businessId: string;
  chatroomId: string;
  paymentId: string;
  contactId: string;
  requestedAmount: string;
  description: string;
  title?: string;
  message: Message;
}

interface PaymentRequestState {
  isPaid: boolean;
  isLoading: boolean;
}

class PaymentRequest extends React.Component<
  PaymentRequestProps,
  PaymentRequestState
> {
  readonly state = {
    isPaid: false,
    isLoading: true,
  };

  async componentDidMount() {
    const { paymentId } = this.props;
    const isPaid = await this.isPaymentPaid(paymentId);
    this.setState({ isPaid, isLoading: false });
  }

  onPayPress = () => {
    const { businessId, paymentId, isPrimaryLanguage, locale } = this.props;
    const langQueryParam = isPrimaryLanguage === false ? `&lang=${locale}` : '';
    window.open(
      `https://www.wix.com/payment-request?metaSiteId=${businessId}&orderId=${paymentId}${langQueryParam}`,
      undefined,
      'noopener,noreferrer',
    );
  };

  renderButton = () => {
    const { isLoading, isPaid } = this.state;
    const { t, textColor, buttonTextColor } = this.props;
    const _selectedRadiusOption = this.props.selectedRadiusOption;
    const buttonAddedStyle = {
      color: buttonTextColor,
      backgroundColor: textColor,
      borderRadius: `${_selectedRadiusOption}px`,
    };
    if (isLoading) {
      return (
        <div data-hook="button-loader" className={styles.loader}>
          <Loader />
        </div>
      );
    }
    if (!isPaid) {
      return (
        <button
          data-hook="pay-button"
          className={styles.submit}
          style={buttonAddedStyle}
          onClick={this.onPayPress}
        >
          {t('pay.button')}
        </button>
      );
    }
  };

  async isPaymentPaid(paymentId: string): Promise<boolean> {
    const { serverApi } = this.props;
    try {
      const { isPaymentApproved } = await serverApi.getPaymentSummary(
        paymentId,
      );
      return isPaymentApproved;
    } catch (e) {
      console.error('There was a problem getting the payment summary', e);
      return false;
    }
  }

  render() {
    const { isPaid } = this.state;
    const {
      t,
      requestedAmount,
      description,
      primaryColor,
      textColor,
      fontFamily,
      message,
      title,
    } = this.props;
    const _selectedRadiusOption = this.props.selectedRadiusOption;

    const topContainerAddedStyle = {
      background: primaryColor,
      color: textColor,
      borderRadius: `${_selectedRadiusOption}px ${_selectedRadiusOption}px 0 0`,
      marginBottom: '-1px',
    };

    const BottomContainerAddedStyle = {
      color: textColor,
      background: primaryColor,
      borderRadius: `0 0 ${_selectedRadiusOption}px ${_selectedRadiusOption}px`,
      marginTop: '2px',
    };

    return (
      <div
        data-hook="payment-request"
        className={styles.container}
        style={{ fontFamily, borderRadius: _selectedRadiusOption }}
      >
        <TitleBubble message={message} title={title} />
        <div
          data-hook="payment-request-top-container"
          className={styles.topContainer}
          style={topContainerAddedStyle}
        >
          <div data-hook="payment-request-title" className={styles.headerTitle}>
            {t('payment-request.title')}
          </div>
          <div data-hook="requested-amount" className={styles.requestedAmount}>
            {requestedAmount}
          </div>
        </div>
        <div
          data-hook="payment-request-bottom-container"
          className={styles.bottomContainer}
          style={BottomContainerAddedStyle}
        >
          {isPaid && (
            <>
              <div data-hook="iconV" className={styles.iconV}>
                <IconV size="42px" />
              </div>
              <div data-hook="successfully-paid" className={styles.description}>
                {t('payment-request.successfully.paid')}
              </div>
            </>
          )}
          <div
            data-hook="payment-request-description"
            className={styles.description}
          >
            {description}
          </div>
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

const PaymentRequestWrapper: React.FC<
  PaymentRequestProps & Services & AppState & EditorSettings & Theme
> = ({
  styleParams,
  publicData,
  siteLanguage,
  isPrimaryLanguage,
  serverApi,
  chatWeb,
  ...props
}) => (
  <PaymentRequest
    {...props}
    primaryColor={styleParams?.colors?.yourMessageBackgroundColor?.value}
    textColor={styleParams?.colors?.yourMessageFontColor?.value}
    buttonTextColor={chatWeb?.room.button.textColor}
    selectedRadiusOption={publicData?.design?.selectedRadiusOption}
    locale={siteLanguage}
    isPrimaryLanguage={isPrimaryLanguage}
    serverApi={serverApi}
  />
);

export default withLockedTranslation(
  withServices(
    withTheme(
      withAppState(withEditorSettings(translate()(PaymentRequestWrapper))),
    ),
  ),
);
