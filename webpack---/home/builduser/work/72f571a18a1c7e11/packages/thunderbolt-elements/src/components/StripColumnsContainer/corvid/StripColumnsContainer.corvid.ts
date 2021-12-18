import { composeSDKFactories } from '@wix/editor-elements-corvid-utils';
import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import { SdkInstance } from '@wix/editor-elements-types';
import {
  backgroundPropsSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
  createElementPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';
import { IMediaContainerSDK } from '../../MediaContainers/MediaContainer/MediaContainer.types';
import { corvidName as type } from '../constants';
import {
  IStripColumnsContainerOwnSDKFactory,
  IStripColumnsContainerSDK,
  IStripColumnsContainerSDKFactory,
  StripColumnsContainerProps,
} from '../StripColumnsContainer.types';

const stripColumnsContainerSDKFactory: IStripColumnsContainerOwnSDKFactory =
  sdkProps => {
    const { metaData } = sdkProps;

    const ownBackgroundSDK = backgroundPropsSDKFactory(sdkProps);

    const getColumns = (): Array<IMediaContainerSDK> =>
      metaData
        .getChildren()
        .filter((child: SdkInstance) => child.type === '$w.Column');

    return {
      get background() {
        const columns = getColumns();
        return {
          get src() {
            const ownSrc = ownBackgroundSDK.background.src;
            if (!ownSrc && columns.length === 1) {
              const [column] = columns;
              return column.background.src;
            }
            return ownSrc;
          },
          set src(newSrc: string) {
            ownBackgroundSDK.background.src = newSrc;
            if (columns.length === 1) {
              const [column] = columns;
              column.background.src = newSrc;
            }
          },
        };
      },
      get columns() {
        return getColumns();
      },
      get type() {
        return type;
      },
      toJSON() {
        return {
          ...toJSONBase(metaData),
          type,
        };
      },
    };
  };

const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk: IStripColumnsContainerSDKFactory = composeSDKFactories<
  StripColumnsContainerProps,
  IStripColumnsContainerSDK
>(
  elementPropsSDKFactory,
  stripColumnsContainerSDKFactory,
  childrenPropsSDKFactory,
  clickPropsSDKFactory,
);

export default createComponentSDKModel(sdk);
