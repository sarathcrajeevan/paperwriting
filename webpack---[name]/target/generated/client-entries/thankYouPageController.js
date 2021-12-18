import userController from '/home/builduser/agent00/work/1cfac24d837429e2/client/wixstores-client/wixstores-client-thank-you-page-ooi/src/components/thankYouPage/controller.ts';
import createControllerWrapper from 'yoshi-flow-editor-runtime/build/esm/controllerWrapper.js';
import {

} from 'yoshi-flow-editor-runtime/build/esm/controller/httpClientProp';

var sentryConfig = {
    DSN: 'https://5ce86095794d4b0dbded2351db71baf8@o37417.ingest.sentry.io/5792095',
    id: '5ce86095794d4b0dbded2351db71baf8',
    projectName: 'wixstores-client-thank-you-page-ooi',
    teamName: 'wixstores',
};

var experimentsConfig = {
    "scope": "stores"
};

var translationsConfig = {
    "default": "en",
    "defaultTranslationsPath": "/home/builduser/agent00/work/1cfac24d837429e2/client/wixstores-client/wixstores-client-thank-you-page-ooi/src/assets/locales/messages_en.json"
};

var biConfig = {
    "owner": "@wix/bi-logger-ec-sf",
    "visitor": "@wix/bi-logger-ec-sf",
    "enableUniversalEvents": false
};

var defaultTranslations = {
    "THANK_YOU_MSG": "THANKS FOR SHOPPING, {{username}}!",
    "THANK_YOU_MSG_WITHOUT_NAME": "THANKS FOR SHOPPING!",
    "LIKE_YOUR_STYLE_TITLE": "HOPE TO SEE YOU AGAIN SOON.",
    "SUMMARY_TITLE": "SUMMARY",
    "ORDER_NUMBER_TITLE": "Your order number:",
    "TOTAL_COST_TITLE": "Total cost:",
    "SHIPPING_TO_TITLE": "Shipping to:",
    "SEND_EMAIL_TEXT": " ",
    "CONTINUE_SHOPPING_BUTTON": "Continue Shopping",
    "SHIPPING_TO": "{{city}}, {{state}} {{zipCode}}, {{country}}",
    "thankYou.TITLE": "Thank you for your order.",
    "thankYou.TITLE_WITH_NAME": "Thank you for your order, {{fullName}}.",
    "thankYou.SUBTITLE": "You'll receive an email confirmation soon.",
    "thankYou.ORDER_NUMBER_LABEL": "Order No:",
    "thankYou.TOTAL_LABEL": "Total:",
    "thankYou.OFFLINE_PAYMENT_LABEL": "Offline Payment",
    "thankYou.STORE_PICKUP_LABEL": "Pickup",
    "thankYou.STORE_PICKUP_TIME": "Ready for pickup: {{deliveryTime}}",
    "thankYou.SHIPPING_LABEL": "Shipping to:",
    "thankYou.DELIVERY_ADDRESS": "{{addressLine}}\n{{city}}, {{state}} {{zipCode}}\n{{country}}",
    "thankYou.DELIVERY_ADDRESS_FULL": "{{fullName}}\n{{company}}\n{{addressLine}}\n{{city}}, {{state}} {{zipCode}}\n{{country}}\n{{phone}}",
    "thankYou.DELIVERY_ADDRESS_FULL_INCLUDING_ADDRESS_LINE_2": "{{fullName}}\n{{company}}\n{{addressLine}}, {{addressLine2}}\n{{city}}, {{state}} {{zipCode}}\n{{country}}\n{{phone}}",
    "thankYou.DOWNLOAD_LINKS_LABEL": "Your Downloads:",
    "thankYou.DOWNLOAD_LINK_LABEL": "Download",
    "thankYou.FOOTER_CONFIRMATION_TEXT": "Keep an eye on your inbox - a confirmation email is on its way...",
    "thankYou.FOOTER_DOWNLOADS_CONFIRMATION_TEXT": "Downloads available for 30 days. And keep an eye on your inbox - we have also sent them by email...",
    "thankYou.FOOTER_LINK": "Continue Shopping",
    "thankYou.LOADING_TITLE": "Processing your payment...",
    "thankYou.PENDING_ORDER_MESSAGE": "Your order is being processed.\nWe will notify you once it has been approved by email to {{buyerMail}}.",
    "THANK_YOU_PAGE_PLAN_DURATION_DESCRIPTION_SINGULAR": "1 {{frequencyUnitSingular}} subscription",
    "THANK_YOU_PAGE_SUBSCRIPTION_PLAN_LABEL": "Subscription:",
    "THANK_YOU_PAGE_PLAN_DURATION_DESCRIPTION_PLURAL": "{{numberOfFrequencyUnits}} {{frequencyUnitSingular}} subscription",
    "THANK_YOU_PAGE_SUBSCRIPTION_TITLE": "Thank you for subscribing, {{fullName}}!",
    "THANK_YOU_PAGE_PLAN_FREQUENCY_DESCRIPTION": "{{price}} / {{frequencyUnitSingular}}",
    "THANK_YOU_PAGE_PLAN_MONTHS": "month",
    "THANK_YOU_PAGE_PLAN_YEAR": "year",
    "THANK_YOU_PAGE_PLAN_WEEK": "week",
    "THANK_YOU_PAGE_PLAN_WEEKS": "week",
    "THANK_YOU_PAGE_PLAN_MONTH": "month",
    "THANK_YOU_PAGE_PLAN_YEARS": "year",
    "thankYou.DOWNLOAD_LINKS_ERROR": "Download links are currently not available.",
    "thankYou.DOWNLOAD_LINKS_ERROR_CONTINUED": "You’ll receive an email confirmation soon with the download links to your products.",
    "THANK_YOU_PAGE_PLAN_DURATION_DESCRIPTION_AUTORENEW": "Auto-renew until canceled",
    "thankYouPage.shipping.label": "Shipping",
    "thankYouPage.paymentMethod.label": "Payment method",
    "thankYouPage.subtitle.orderNumber": "Order number: {{orderNumber}}",
    "thankYouPage.subtitle.orderConfirmation": "You'll receive a confirmation email soon.",
    "thankYouPage.quantity.label": "Qty:",
    "thankYouPage.total.label": "Total",
    "thankYouPage.title.withName": "Thank you, {{fullName}}",
    "thankYouPage.customerNote.previewText": "Your customer's note will show here. ",
    "thankYouPage.giftCard.label": "Gift card",
    "thankYouPage.tax.label": "Tax",
    "thankYouPage.billingInfo.label": "Billing address",
    "thankYouPage.customerNote.label": "Note",
    "thankYouPage.back.footerLink": "Back",
    "thankYouPage.subtotal.label": "Subtotal",
    "thankYouPage.promoCode.label": "Promo code",
    "thankYouPage.moreServices.footerLink": "Check Out More Services",
    "thankYouPage.errorPage.error.title": "This page can't be accessed",
    "thankYouPage.errorPage.error.body": "Make sure you’re logged in to the right account, or check the URL and try again.",
    "thankYouPage.shippingAddress.label": "Shipping address",
    "thankYouPage.pendingOrder.title.withName": "Thank you, {{fullName}}",
    "thankYouPage.pendingOrder.body": "Your order is being processed. We'll send an order confirmation to {{buyerEmail}} if it's approved.",
    "thankYouPage.addressFormat.line1.withoutSubdivision": "{{addressLine1}}\n{{city}}, {{zipCode}}, {{country}}",
    "thankYouPage.addressFormat.line2.withoutSubdivision": "{{addressLine1}}, {{addressLine2}}\n{{city}}, {{zipCode}}, {{country}}",
    "thankYouPage.addressFormat.line2.withSubdivision": "{{addressLine1}}, {{addressLine2}}\n{{city}}, {{subdivision}} {{zipCode}}, {{country}}",
    "thankYouPage.addressFormat.line1.withSubdivision": "{{addressLine1}}\n{{city}}, {{subdivision}} {{zipCode}}, {{country}}"
};

import biLogger from '/home/builduser/agent00/work/1cfac24d837429e2/client/wixstores-client/wixstores-client-thank-you-page-ooi/node_modules/@wix/bi-logger-ec-sf/dist/src/index.js';

const _controller = createControllerWrapper(userController, {
    sentryConfig,
    biConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    appName: "Wixstores Thank You Page OOI",
    appDefinitionId: "1380b703-ce81-ff05-f115-39571d94dfcd",
    componentId: "1380bbb4-8df0-fd38-a235-88821cf3f8a4",
    projectName: "wixstores-client-thank-you-page-ooi",
    defaultTranslations,
}, {

});
export const controller = _controller;
export default _controller;