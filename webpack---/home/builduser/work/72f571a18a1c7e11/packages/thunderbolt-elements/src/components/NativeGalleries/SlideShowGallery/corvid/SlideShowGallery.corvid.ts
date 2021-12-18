import { SdkInstance } from '@wix/editor-elements-types';
import { assert, composeSDKFactories } from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  ISlideShowGalleryOwnSDK,
  ISlideShowGalleryProps,
  ISlideShowGallerySDKFactory,
} from '../SlideShowGallery.types';
import {
  onItemClickSDKFactory,
  clickActionSDKFactory,
  currentItemSDKFactory,
  createElementPropsSDKFactory,
  navigationButtonsSDKFactory,
  playablePropsSDKFactory,
  toJSONBase,
} from '../../../../core/corvid/props-factories';
import {
  convertGalleryItemsToUserModel,
  convertToGalleryItemsPropsOrReport,
} from '../../../../core/corvid/galleries/GallerySDKUtils';

const slideShowGallerySDKFactory: ISlideShowGallerySDKFactory = ({
  sdkData,
  registerEvent,
  props,
  metaData,
  compRef,
  setProps,
  platformUtils: { linkUtils },
  createSdkState,
}) => {
  const [state, setState] = createSdkState<{
    navigationEndCallbacks: ReadonlyArray<Function>;
  }>({ navigationEndCallbacks: [] });

  // TODO: take the arg currentIndex and get the new sdkInstance for cb
  registerEvent('onNavigationEnd', () => {
    state.navigationEndCallbacks.forEach(cb => cb());
    setState({ navigationEndCallbacks: [] });
  });
  return {
    next() {
      return new Promise<SdkInstance>(resolve => {
        setState({
          navigationEndCallbacks: [...state.navigationEndCallbacks, resolve],
        });
        compRef.next();
      });
    },
    previous() {
      return new Promise<SdkInstance>(resolve => {
        setState({
          navigationEndCallbacks: [...state.navigationEndCallbacks, resolve],
        });
        compRef.previous();
      });
    },
    get isPlaying() {
      const isPlaying = props.isPlaying;
      if (assert.isBoolean(isPlaying)) {
        return isPlaying;
      }
      return props.autoPlay && props.items.length > 1;
    },
    get items() {
      return convertGalleryItemsToUserModel(props.items, linkUtils);
    },
    set items(items) {
      const propsItems = convertToGalleryItemsPropsOrReport(
        items,
        metaData.role,
        metaData.compId,
        sdkData.dataId,
        linkUtils,
        sdkData.imageDisplayMode,
      );
      if (propsItems) {
        setProps({ items: propsItems });
      }
    },
    get galleryCapabilities() {
      return {
        hasCurrentItem: true,
        hasNavigationButtons: true,
        isAnimatable: true,
        isPlayable: true,
        supportsAllMediaTypes: false,
      };
    },
    get type() {
      return '$w.Gallery';
    },

    toJSON() {
      const [currentItem] = convertGalleryItemsToUserModel(
        [props.items[this.currentIndex]],
        linkUtils,
      );
      return {
        ...toJSONBase(metaData),
        clickAction: this.clickAction,
        currentIndex: this.currentIndex,
        currentItem,
        showNavigationButtons: this.showNavigationButtons,
        items: convertGalleryItemsToUserModel(props.items, linkUtils),
        type: '$w.Gallery',
      };
    },
  } as any;
};

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<
  ISlideShowGalleryProps,
  ISlideShowGalleryOwnSDK
>(
  elementPropsSDKFactory,
  clickActionSDKFactory,
  navigationButtonsSDKFactory,
  currentItemSDKFactory,
  playablePropsSDKFactory,
  slideShowGallerySDKFactory,
  onItemClickSDKFactory,
);

export default createComponentSDKModel(sdk);
