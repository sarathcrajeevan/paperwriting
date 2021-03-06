import userController from '/home/builduser/agent00/work/1f82798b85adcd2d/client/wixstores-client/wixstores-client-cart-ooi/src/components/cart/controller.ts';
import createControllerWrapper from 'yoshi-flow-editor-runtime/build/esm/controllerWrapper.js';
import {

} from 'yoshi-flow-editor-runtime/build/esm/controller/httpClientProp';

var sentryConfig = {
    DSN: 'https://7a9383877d1648169973b9d6339b753b@o37417.ingest.sentry.io/5552111',
    id: '7a9383877d1648169973b9d6339b753b',
    projectName: 'wixstores-client-cart-ooi',
    teamName: 'wixstores',
};

var experimentsConfig = {
    "scope": "stores"
};

var translationsConfig = {
    "default": "en",
    "defaultTranslationsPath": "/home/builduser/agent00/work/1f82798b85adcd2d/client/wixstores-client/wixstores-client-cart-ooi/src/assets/locales/messages_en.json"
};

var biConfig = {
    "owner": "@wix/bi-logger-ec-sf",
    "visitor": "@wix/bi-logger-ec-sf",
    "enableUniversalEvents": false
};

var defaultTranslations = {
    "cart.empty_cart_title": "Cart is empty",
    "cart.continue_shopping": "Continue Shopping",
    "cart.shopping_cart_title": "My Cart",
    "cart.list_price_label": "Price",
    "cart.list_quantity_label": "Qty",
    "cart.list_total_label": "Total",
    "cart.list_item.sku": "SKU",
    "cart.remove_button": "Remove",
    "cart.buyer_note_add_button_label": "Add a note",
    "cart.buyer_note_placeholder": "Instructions? Special requests? Add them here.",
    "cart.coupon_add_button_label": "Enter a promo code",
    "cart.coupon_input_placeholder": "Enter a promo code",
    "cart.coupon_apply_button_label": "Apply",
    "cart.coupon": "Promo code",
    "cart.coupon_applied": "applied!",
    "cart.change": "Change",
    "cart.estimated_shippingV2": "Shipping to",
    "cart.estimated_shipping": "Shipping",
    "cart.estimated_tax": "Estimated Tax",
    "cart.estimated_total": "Total",
    "cart.estimated_shipping_address": "{{subdivision}}, {{country}}",
    "cart.fallback_estimated_shipping_address": "Unknown",
    "cart.delivery_method_picker.pickup_address": "{{addressLine}}, {{city}}, {{subdivision}}, {{country}}",
    "cart.delivery_method_picker.pickup_address_without_subdivision": "{{addressLine}}, {{city}}, {{country}}",
    "cart.subtotal": "Subtotal",
    "cart.secure_checkout": "Checkout",
    "cart.connect_with": "Check out with",
    "cart.e_wallet_paypal_sr_name": "Checkout with PayPal",
    "cart.errors.item_out_of_stock": "Sorry, this item is out of stock.",
    "cart.errors.item_quantity_exceed_inventory": "Only {{itemsAmount}} left in stock",
    "cart.errors.coupons.ERROR_COUPON_DOES_NOT_EXIST": "Promo code isn't valid.",
    "cart.errors.coupons.ERROR_COUPON_IS_NOT_ACTIVE_YET": "This promotion didn't start yet. Check back soon.",
    "cart.errors.coupons.ERROR_COUPON_HAS_EXPIRED": "This promotion has ended.",
    "cart.errors.coupons.ERROR_COUPON_USAGE_EXCEEDED": "This promo code has exceeded the number of times it can be used.",
    "cart.errors.coupons.ERROR_COUPON_IS_DISABLED": "This promotion isn't available at the moment.",
    "cart.errors.coupons.ERROR_INVALID_COMMAND_FIELD": "Your code can't have more than 20 characters.",
    "cart.errors.coupons.ERROR_INVALID_PRODUCTS": "This promo code is only valid for specific products.",
    "cart.errors.coupons.ERROR_INVALID_SUBTOTAL": "This coupon is only valid for orders above {{subtotal}}.",
    "cart.errors.coupons.ERROR_INVALID_PRODUCT_QUANTITY": "This promo code is only valid if you buy more than {{quantity}} specific products.",
    "cart.errors.cant_ship_to_country": "Sorry, we don't ship to your area.",
    "cart.errors.cant_ship_to_your_country": "Sorry, we don't ship to your country.",
    "cart.errors.cant_sell_to_country": "Sorry, we don't sell to {{country}}.",
    "cart.errors.cant_sell_to_your_country": "Sorry, we don't sell to your country.",
    "cart.change_region_modal.title": "Select Destination",
    "cart.change_region_modal.country_label": "Country",
    "cart.change_region_modal.zip_label": "Zip / Postal Code",
    "cart.change_region_modal.update": "Update",
    "cart.change_region_modal.cancel": "Cancel",
    "cart.change_region_modal.errors.required_country": "Choose a Country",
    "cart.change_region_modal.errors.required_subdivision": "Mandatory field",
    "cart.change_region_modal.errors.required_zip": "Enter a valid Zip /Postal Code",
    "cart.delivery_error_modal.cant_ship_to_country": "Sorry, we don't ship to {{country}}.",
    "cart.delivery_error_modal.ok": "OK",
    "cart.set_payment_method.set_method": "Connect Payment Methods to Your Site",
    "cart.set_payment_method.set_method_unsaved": "To Checkout, Set a Payment Method",
    "cart.set_payment_method.manage_store": "Click the Wix Stores menu and select \"Manage Store\" to connect a payment method.",
    "cart.set_payment_method.manage_store_unsaved": "Go to your Store Manager and connect at least one payment method, so buyers have a way to pay you during checkout.",
    "cart.set_payment_method.ok": "OK",
    "cart.set_payment_method.take_me_there": "Connect Payment Methods",
    "cart.set_payment_method.no_thanks": "No Thanks",
    "cart.upgrade_to_premium.open_your_store": "Get Your Store Open for Business",
    "cart.upgrade_to_premium.upgrade_to_ecom": "We've reached the end of the checkout preview.\nTo open for business and accept online orders from your customers, upgrade to a Business & eCommerce plan.",
    "cart.upgrade_to_premium.upgrade_now": "Upgrade Now",
    "cart.upgrade_to_premium.just_place_order": "I just want to place a test order",
    "cart.upgrade_to_premium.checkout_in_published": "Please note: To see what the checkout process looks\nlike, go to the published site",
    "cart.no_online_payments.title": "We can't accept online orders right now",
    "cart.no_online_payments.message": "Please contact us to complete your purchase.",
    "cart.no_online_payments.ok": "Got It",
    "cart.set_shipping_method.set_method": "Customers Can't Purchase Physical Products",
    "cart.set_shipping_method.choose_destinations": "Activate a shipping region to sell physical products in your store.",
    "cart.set_shipping_method.ok": "OK",
    "cart.set_shipping_method.no_thanks": "No Thanks",
    "cart.set_shipping_method.take_me_there": "Activate Shipping",
    "cart.not_in_live_site.ok": "Got it",
    "cart.not_in_live_site.title": "View Checkout on Your Published Site",
    "cart.not_in_live_site.content": "You've reached the end of the checkout preview. To see what the checkout process looks like, go to your published site.",
    "cart.sr_back_link_description": "item number {{item_index}}, {{item_name}}, back to product page",
    "cart.sr_items": "items",
    "cart.sr_item_was_removed": "{{item_name}} was removed from the cart",
    "cart.quantity_sr_name": "quantity",
    "cart.sr.quantity": "Quantity",
    "cart.sr.chooseQty": "Choose quantity",
    "cart.sr.addQty": "Add one item",
    "cart.sr.removeQty": "Remove one item",
    "cart.sr.totalQty": "Total quantity",
    "cart.sr_section_navigation": "quick navigation",
    "cart.sr_section_coupon_and_note": "cart items",
    "cart.sr_section_total": "cart summary",
    "cart.sr_remove_item_from_cart": "remove {{item_name}} from the cart",
    "cart.sr_shipping_destination": "current shipping destination: {{country}}",
    "cart.sr_change_destination": "click to change shipping destination",
    "cart.sr_remove_coupon": "click to remove promo code",
    "cart.sr_coupon_applied": "promo code {{coupon_code}} applied",
    "cart.shipping_destination.choose_region": "Estimate Shipping",
    "cart.shipping_destination.tax.choose_region": "Estimate Taxes",
    "cart.shipping_destination.shipping_and_tax.choose_region": "Estimate Shipping & Taxes",
    "cart.tooltips.estimated_shipping_message": "Your final shipping cost will be shown in Checkout.",
    "cart.tooltips.estimated_tax_message": "Your final taxes will be shown in Checkout.",
    "cart.free_shipping": "FREE",
    "cart.payment_error_message": "{{paymentMethodName}} contacted us to say that your payment didn't go through. Please follow up with {{paymentMethodName}} to try and resolve the issue.",
    "cart.payment_error_message_credit_card": "Your card authentication failed. Please try again or select a different payment method",
    "cart.payment_error_title": "There's a Problem with Your Payment",
    "cart.payment_error_button": "Contact {{paymentMethodName}}",
    "cart.summary.title": "Cart Summary",
    "cart.summary.displayEstimatedShipping.title": "Display Estimated Shipping",
    "cart.summary.displayEstimatedShipping.description": "Show customers an estimated shipping rate, based on their location. Your Store Pickup option will also be displayed here, if you offer one.",
    "cart.summary.displayEstimatedTax.title": "Display Estimated Taxes",
    "cart.summary.displayEstimatedTax.description": "Show customers estimated tax costs, based on their location.",
    "cart.summary.displayEstimatedTax.tooltip": "Estimated taxes will not be shown if you have included taxes in the price of your products.",
    "cart.summary.displayEstimatedShipping.tooltip": "Shipping rates will not be applied to digital products.",
    "cart.errors.invalid_zip_postal_code": "Please enter a valid zip / postal code.",
    "cart.orderSummary.title": "Order summary",
    "cart.currency_converter_disclaimer": "Processed in {{mainCurrency}}",
    "cart.total.taxIncluded": "Tax included",
    "cart.errorLoading.title": "There was a problem loading your cart. Refresh the page and try again.",
    "cart.set_shipping_method.learnMore": "Learn more",
    "cart.set_shipping_method.URL": "https://support.wix.com/en/article/setting-up-shipping-in-wix-stores",
    "cart.sr.checkoutSection": "Checkout",
    "cart.subscriptions_comingSoon_modal_title": "Subscriptions Are Coming Soon",
    "cart.subscriptions_comingSoon_modal_body": "Contact us about this offer in the meantime, so we can help you out.",
    "cart.subscriptions_comingSoon_modal_closeCTA": "Close",
    "cart.previewMode.upgradeModal.bullet2": "Build customer loyalty and win repeat sales",
    "cart.previewMode.upgradeModal.title": "Upgrade to Sell Subscriptions",
    "cart.previewMode.upgradeModal.bullet1": "Add subscription offers to any of your products",
    "cart.previewMode.upgradeModal.maybeLaterLink": "Maybe Later",
    "cart.previewMode.upgradeModal.subtitle": "Upgrade to get advanced business tools and boost your online store.",
    "cart.previewMode.upgradeModal.upgradeCTA": "Upgrade Now",
    "cart.previewMode.upgradeModal.bullet3": "Get advanced business features, like tax automation",
    "cart.errors.coupons.ERROR_COUPON_LIMIT_PER_CUSTOMER_EXCEEDED": "You already used this promo code.",
    "cart.note.shipping.atCheckout": "Shipping will be calculated at checkout based on your full address.",
    "cart.price.taxIncluded.label": "Tax included",
    "cart.note.minOrderWithCouponDirectLink.text": "Minimum order amount for this discount is {{currency}}{{minAmount}}. Add {{currency}}{{additionalAmount}} to get your discount.",
    "cart.note.minOrderWithCouponDirectLink.link": "Continue Shopping",
    "cart.note.eligibleProductsCouponDirectLink.text": "Your discount wasn???t applied. Add eligible products to get your discount.",
    "cart.note.eligibleProductsCouponDirectLink.link": "Continue Shopping",
    "cart.estimated_pickup": "Store Pickup",
    "cart.note.minimumOrder.text": "We only ship orders over {{minAmount}}. Want to add another {{additionalAmount}} to your cart? ",
    "cart.note.minimumOrder.link": "Continue Shopping",
    "cart.errors.item_quantity_exceed_inventory_no_number": "We don't have enough in stock.",
    "cart.orderSummary.secureCheckout.label": "Secure Checkout"
};

import biLogger from '/home/builduser/agent00/work/1f82798b85adcd2d/client/wixstores-client/wixstores-client-cart-ooi/node_modules/@wix/bi-logger-ec-sf/dist/src/index.js';

const _controller = createControllerWrapper(userController, {
    sentryConfig,
    biConfig,
    experimentsConfig,
    biLogger,
    translationsConfig,
    appName: "Wixstores Cart OOI",
    appDefinitionId: "1380b703-ce81-ff05-f115-39571d94dfcd",
    componentId: "1380bbab-4da3-36b0-efb4-2e0599971d14",
    projectName: "wixstores-client-cart-ooi",
    defaultTranslations,
}, {

});
export const controller = _controller;
export default _controller;