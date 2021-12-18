import * as vectorImage from '@wix/thunderbolt-commons/dist/vectorImage';
import { VectorImageSdkData } from '@wix/thunderbolt-components';
import { CorvidSDKFactory } from '@wix/editor-elements-types';
import {
  withValidation,
  messages,
  reportError,
  composeSDKFactories,
  assert,
  fetchSvg,
  resolveSvg,
  createSvgWixMediaUrl,
  isFallbackSvg,
  SVG_TYPE_INLINE,
  SVG_TYPE_URL,
} from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import { VectorImageProps } from '../VectorImage.types';
import {
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';

const processSvg = (rawSvg: string, sdkData: ClientSdkData) => {
  const { info: svgInfo } = vectorImage.parseSvgString(rawSvg);
  return vectorImage.transformVectorImage(rawSvg, {
    ...sdkData,
    svgInfo,
  } as vectorImage.VectorImageTransformationOptions);
};

const getSvgStyles = (shouldScaleStroke: boolean) => {
  return shouldScaleStroke
    ? { '--stroke-width': 'unset', '--stroke': 'unset' }
    : {};
};

const fetchAndTransformSvg = async (
  type: string,
  content: string,
  shouldScaleStroke: boolean,
  sdkData: ClientSdkData,
) => {
  if (type === SVG_TYPE_INLINE) {
    return { svgContent: content, shouldScaleStroke };
  }
  const svg = await fetchSvg(content);
  return {
    svgContent: isFallbackSvg(svg) ? svg : processSvg(svg, sdkData),
    shouldScaleStroke,
  };
};

type ClientSdkData = VectorImageSdkData & {
  userSrc?: string;
};

export type VectorImageSDK = {
  src: string;
};

const _vectorImageSDKFactory: CorvidSDKFactory<
  VectorImageProps,
  VectorImageSDK,
  ClientSdkData
> = ({ setProps, setStyles, sdkData, metaData, createSdkState }) => {
  const [state, setState] = createSdkState<{ userSrc?: string }>({});
  return {
    get src() {
      return (
        state.userSrc || createSvgWixMediaUrl(sdkData.svgId, sdkData.altText)
      );
    },
    set src(url) {
      setState({ userSrc: url });
      const { type, data } = resolveSvg(url, sdkData.mediaSvgUrl);
      const shouldScaleStroke = [SVG_TYPE_INLINE, SVG_TYPE_URL].includes(type);
      setStyles(getSvgStyles(shouldScaleStroke));
      setProps(fetchAndTransformSvg(type, data, shouldScaleStroke, sdkData));
    },
    toJSON() {
      const { src } = this;
      return {
        ...toJSONBase(metaData),
        src,
      };
    },
  };
};

const vectorImageSDKFactory = withValidation(
  _vectorImageSDKFactory,
  {
    type: ['object'],
    properties: { src: { type: ['string'] } },
  },
  {
    src: [
      (value: VectorImageSDK['src']) => {
        const isValid = assert.isSVG(value);
        if (!isValid) {
          // FIXME - customRule will eventually need to inject 'index' argment (for repeaters scenario)
          reportError(messages.invalidSvgValue(value));
        }
        return true;
      },
    ],
  },
);

export const sdk = composeSDKFactories<VectorImageProps, VectorImageSDK>(
  createElementPropsSDKFactory(),
  clickPropsSDKFactoryWithUpdatePlatformHandler,
  linkPropsSDKFactory,
  vectorImageSDKFactory,
);

export default createComponentSDKModel(sdk);
