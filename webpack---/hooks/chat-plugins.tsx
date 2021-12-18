import { useEffect } from 'react';
import chatAppsRegistry from '@wix/chat-apps-registry';
import { APP_PLUGINS } from '../v1/constants/app-plugins';
import Coupon from '../components/Coupon/Coupon';
import PaymentRequest from '../components/PaymentRequest/PaymentRequest';
import LeadCaptureForm from '../components/LeadCaptureForm/LeadCaptureForm';

export const useChatPlugins = () => {
  useEffect(() => {
    if (!chatAppsRegistry.isAppRegistered(APP_PLUGINS.LEAD_CAPTURE_FORM)) {
      chatAppsRegistry.registerApp({
        appName: APP_PLUGINS.LEAD_CAPTURE_FORM,
        component: LeadCaptureForm,
      });
    }

    if (!chatAppsRegistry.isAppRegistered(APP_PLUGINS.COUPONS)) {
      chatAppsRegistry.registerApp({
        appName: APP_PLUGINS.COUPONS,
        component: Coupon,
      });
    }

    if (!chatAppsRegistry.isAppRegistered(APP_PLUGINS.PAYMENT_REQUEST)) {
      chatAppsRegistry.registerApp({
        appName: APP_PLUGINS.PAYMENT_REQUEST,
        component: PaymentRequest,
      });
    }
  }, []);
};
