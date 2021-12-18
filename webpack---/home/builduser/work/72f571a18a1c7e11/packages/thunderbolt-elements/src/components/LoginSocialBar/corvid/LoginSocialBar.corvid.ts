import { LoginSocialBarSdkData } from '@wix/thunderbolt-components';
import {
  withValidation,
  composeSDKFactories,
  messages,
  reportError,
  assert,
  resolveAndFetchSvg,
} from '@wix/editor-elements-corvid-utils';

import { createComponentSDKModel } from '@wix/editor-elements-integrations';
import {
  createElementPropsSDKFactory,
  toJSONBase,
} from '../../../core/corvid/props-factories';
import {
  ILoginSocialBarProps,
  ILoginSocialBarOwnSDKFactory,
  ILoginSocialBarSDK,
  ILoginSocialBarSDKMenuItems,
  ILoginSocialBarSDKMenuItem,
  ILoginSocialBarSDKNavBarItems,
  ILoginSocialBarSDKNavBarItem,
} from '../LoginSocialBar.types';

type CreateAccountNavBarSdkFactoryParams = {
  isMobileOnly?: boolean;
};

type ICommonItem = Partial<
  ILoginSocialBarSDKMenuItem | ILoginSocialBarSDKNavBarItem
>;

const getCommonOptionalItemProps = (
  { link, visibleOnDesktop, visibleOnMobile, displayCount }: ICommonItem,
  isMobileOnly: boolean,
) => ({
  ...(link !== undefined && { link }),
  ...(!isMobileOnly && { visibleOnDesktop: visibleOnDesktop ?? true }),
  visibleOnMobile: visibleOnMobile ?? true,
  ...(typeof displayCount === 'number' && { displayCount }),
});

const cloneMenuItems = (
  menuItems: ILoginSocialBarSDKMenuItems,
  isMobileOnly: boolean,
) =>
  menuItems.map(({ label, ...optionalProps }) => ({
    label,
    ...getCommonOptionalItemProps(optionalProps, isMobileOnly),
  }));

const cloneNavBarItems = (
  navBarItems: ILoginSocialBarSDKNavBarItems,
  isMobileOnly: boolean,
) =>
  navBarItems.map(({ icon, label, ...optionalProps }) => ({
    icon,
    ...(label !== undefined && { label }),
    ...getCommonOptionalItemProps(optionalProps, isMobileOnly),
  }));

const createSdkFactory =
  ({
    isMobileOnly = false,
  }: CreateAccountNavBarSdkFactoryParams): ILoginSocialBarOwnSDKFactory =>
  ({ setProps, sdkData, metaData, createSdkState }) => {
    const { isMobileView = isMobileOnly, baseSvgMediaUrl } = sdkData;
    const isItemVisiblePredicate = ({
      visibleOnDesktop,
      visibleOnMobile,
    }: ICommonItem) => (isMobileView ? visibleOnMobile : visibleOnDesktop);

    const [state, setState] = createSdkState<{
      menuItems: ILoginSocialBarSDKMenuItems;
      navBarItems: ILoginSocialBarSDKNavBarItems;
    }>({
      menuItems: sdkData.menuItems,
      navBarItems: sdkData.navBarItems,
    });

    return {
      get menuItems() {
        return cloneMenuItems(state.menuItems, isMobileOnly);
      },

      set menuItems(value) {
        setState({
          menuItems: value ? cloneMenuItems(value, isMobileOnly) : [],
        });

        const menuItemsProp = state.menuItems
          .filter(isItemVisiblePredicate)
          .map(({ label, link, displayCount }) => ({
            label,
            link: link ? { href: link } : {},
            displayCount,
          }));

        setProps({ menuItems: menuItemsProp });
      },

      get navBarItems() {
        return cloneNavBarItems(state.navBarItems, isMobileOnly);
      },

      set navBarItems(value) {
        setState({
          navBarItems: value ? cloneNavBarItems(value, isMobileOnly) : [],
        });
        const visibleNavBarItems = state.navBarItems.filter(
          isItemVisiblePredicate,
        );

        if (!visibleNavBarItems.length) {
          setProps({ iconItems: [] });
          return;
        }

        setProps(
          Promise.all(
            visibleNavBarItems.map(({ icon }) =>
              resolveAndFetchSvg(icon, baseSvgMediaUrl),
            ),
          ).then(icons => ({
            iconItems: visibleNavBarItems.map(
              ({ label, link, displayCount }, index) => ({
                iconSvgContent: icons[index],
                label: label ?? '',
                link: link ? { href: link } : {},
                displayCount,
              }),
            ),
          })),
        );
      },
      get type() {
        return '$w.AccountNavBar';
      },

      toJSON() {
        return {
          ...toJSONBase(metaData),
          type: '$w.AccountNavBar',
        };
      },
    };
  };

export const createAccountNavBarSdkFactory = (
  params: CreateAccountNavBarSdkFactoryParams = {},
) =>
  withValidation(
    createSdkFactory(params),
    {
      type: ['object'],
      properties: {
        menuItems: {
          type: ['array', 'nil'],
          warnIfNil: true,
          items: {
            type: ['object'],
            properties: {
              label: { type: ['string'] },
              link: { type: ['string'] },
              visibleOnDesktop: { type: ['boolean'] },
              visibleOnMobile: { type: ['boolean'] },
              displayCount: { type: ['number', 'nil'] },
            },
            required: ['label'],
          },
        },
        navBarItems: {
          type: ['array', 'nil'],
          warnIfNil: true,
          items: {
            type: ['object'],
            properties: {
              link: { type: ['string'] },
              icon: { type: ['string'] },
              visibleOnDesktop: { type: ['boolean'] },
              visibleOnMobile: { type: ['boolean'] },
              displayCount: { type: ['number', 'nil'] },
            },
            required: ['icon'],
          },
        },
      },
    },
    {
      navBarItems: [
        (value: ILoginSocialBarSDK['navBarItems']) => {
          let isValid = true;
          if (assert.isArray(value)) {
            value.forEach(({ icon }, index) => {
              if (!assert.isSVG(icon)) {
                isValid = false;
                reportError(
                  messages.invalidMenuItemMessage({
                    propertyName: 'navBarItems',
                    value: icon,
                    index,
                  }),
                );
              }
            });
          }
          return isValid;
        },
      ],
    },
  );

const loginSocialBarSDKFactory = createAccountNavBarSdkFactory();
const elementPropsSDKFactory = createElementPropsSDKFactory();

export const sdk = composeSDKFactories<
  ILoginSocialBarProps,
  ILoginSocialBarSDK,
  LoginSocialBarSdkData
>(elementPropsSDKFactory, loginSocialBarSDKFactory);

export default createComponentSDKModel(sdk);
