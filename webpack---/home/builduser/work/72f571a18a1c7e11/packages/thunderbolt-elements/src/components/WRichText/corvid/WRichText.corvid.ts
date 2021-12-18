import {
  withValidation,
  composeSDKFactories,
  assert,
} from '@wix/editor-elements-corvid-utils';
import { WRichTextSdkData } from '@wix/thunderbolt-components';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  createElementPropsSDKFactory,
  createAccessibilityPropSDKFactory,
  clickPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';
import {
  IWRichTextProps,
  IWRichTextSDK,
  IWRichTextOwnSDKFactory,
} from '../WRichText.types';
import {
  wixGuard,
  endBlockTagRegex,
  endTagRegex,
  startTagRegex,
  wixCodeName as type,
} from '../constants';

import {
  applyTransformationForGetHtml,
  applyTransformationForSetHtml,
  convertLinkProperties,
  removeWixGuard,
  decode,
  insertTextInHtml,
  escape,
  unescape,
  stripImpliedLinks,
} from './utils';

const endBlockTagPattern = new RegExp(endBlockTagRegex, 'mg');
const endTagPattern = new RegExp(endTagRegex, 'mg');
const startTagPattern = new RegExp(startTagRegex, 'mg');
const flow =
  (...fns: Array<Function>) =>
  (html: string) =>
    fns.reduce((output, fn) => fn(output), html);

const isUndefined = (str: string) => (assert.isNil(str) ? '' : str);

export const _wRichTextSdkFactory: IWRichTextOwnSDKFactory = ({
  setProps,
  props,
  platformUtils: { linkUtils },
  metaData,
  sdkData,
  createSdkState,
}) => {
  const [sdkState, setSDKState] = createSdkState<WRichTextSdkData>(sdkData);

  const getLinkProps = (url: string) => {
    if (!sdkState.linkPropsByHref || !sdkState.linkPropsByHref[url]) {
      const linkProperties = linkUtils.getLinkProps(url); // Properties
      setSDKState({
        linkPropsByHref: {
          ...(sdkState.linkPropsByHref || {}),
          [url]: linkProperties,
        },
      });
    }
    return sdkState.linkPropsByHref[url];
  };

  const convertLinksForSetter = (str: string) =>
    convertLinkProperties(str, getLinkProps);

  const convertLinksForGetter = (str: string) =>
    convertLinkProperties(str, getLinkProps, linkUtils.getLink);

  const getHtml = () =>
    removeWixGuard(
      stripImpliedLinks(
        applyTransformationForGetHtml(convertLinksForGetter(props.html)),
      ),
    );

  const getText = () =>
    props.html
      ? decode(
          unescape(
            stripImpliedLinks(removeWixGuard(props.html))
              .replace(/\n/g, '')
              .replace(/<br>/g, '\n')
              .replace(/<br><\/br>/g, '\n')
              .replace(/<br\s*\/?>/g, '\n')
              .replace(endBlockTagPattern, '\n')
              .replace(endTagPattern, '')
              .replace(startTagPattern, '')
              .trim(),
          ),
        )
      : '';

  return {
    get type() {
      return type;
    },

    get html() {
      return getHtml();
    },

    set html(value) {
      setProps({
        html: flow(
          isUndefined,
          applyTransformationForSetHtml,
          convertLinksForSetter,
          linkUtils.getImpliedLinks,
        )(value),
      });
    },

    get text() {
      return getText();
    },

    set text(value) {
      const escapedHTML = value
        ? escape(value).replace(/\n/g, '<br>')
        : wixGuard;

      const html = linkUtils.getImpliedLinks(
        insertTextInHtml(stripImpliedLinks(props.html), escapedHTML),
        { parseEscaped: true },
      );

      setProps({
        html,
      });
    },

    toJSON() {
      return {
        ...toJSONBase(metaData),
        type,
        html: getHtml(),
        text: getText(),
      };
    },
  };
};

const wRichTextSDKFactory = withValidation(_wRichTextSdkFactory, {
  type: ['object'],
  properties: {
    html: { type: ['string', 'nil'], warnIfNil: true },
    text: { type: ['string', 'nil'], warnIfNil: true },
  },
});

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const accessibilityPropsSDKFactory = createAccessibilityPropSDKFactory({
  enableLabelledBy: false,
  enableDescribedBy: false,
  enableScreenReader: true,
});

export const sdk = composeSDKFactories<IWRichTextProps, any, IWRichTextSDK>(
  elementPropsSDKFactory,
  clickPropsSDKFactory,
  accessibilityPropsSDKFactory,
  wRichTextSDKFactory,
);

export default createComponentSDKModel(sdk);
