import * as React from 'react';
import { ReactNode } from 'react';
import {
  IStylableButtonProps,
  IStylableButtonEventHandlers,
} from '../StylableButton.types';
import {
  activateBySpaceButton,
  activateByEnterButton,
  getAriaAttributes,
} from '../../../core/commons/a11y';
import { TestIds } from '../constants';
import Link, { isValidLink } from '../../Link/viewer/Link';
import { getQaDataAttributes } from '../../../core/commons/qaUtils';
import { classes, st } from './StylableButton.component.st.css';

const createIconFromString = (svg: string) => {
  return React.createElement('div', {
    dangerouslySetInnerHTML: {
      __html: svg || '',
    },
  });
};

const ButtonContent: React.FC<{
  icon?: ReactNode;
  label?: string;
  override?: boolean;
}> = ({ label, icon, override }) => (
  <div className={classes.container}>
    {label && (
      <span className={classes.label} data-testid={TestIds.buttonLabel}>
        {label}
      </span>
    )}
    {icon && (
      <span
        className={st(classes.icon, { override: !!override })}
        aria-hidden="true"
        data-testid={TestIds.buttonIcon}
      >
        {icon}
      </span>
    )}
  </div>
);

const getEventHandlers = (
  {
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
  }: Partial<IStylableButtonEventHandlers>,
  isLink: boolean,
  isDisabled: boolean,
) => {
  return {
    onKeyDown: isLink ? activateBySpaceButton : activateByEnterButton,
    onClick: !isDisabled && onClick ? onClick : undefined,
    onDoubleClick: !isDisabled && onDblClick ? onDblClick : undefined,
    onMouseEnter,
    onMouseLeave,
  };
};

const StylableButton: React.FC<IStylableButtonProps> = props => {
  const {
    id,
    link,
    type = 'button',
    svgString,
    label,
    isDisabled,
    className,
    isQaMode,
    fullNameCompType,
    a11y,
    corvid,
    onClick,
    onDblClick,
    onMouseEnter,
    onMouseLeave,
    ariaAttributes,
  } = props;

  const a11yAttr = React.useMemo(
    () =>
      getAriaAttributes({
        ...ariaAttributes,
        ...a11y,
        disabled: a11y.disabled ?? isDisabled,
        label: ariaAttributes?.label ?? a11y.label ?? label,
      }),
    [a11y, label, ariaAttributes, isDisabled],
  );

  const eventHandlers = React.useMemo(
    () =>
      getEventHandlers(
        { onClick, onDblClick, onMouseLeave, onMouseEnter },
        isValidLink(link),
        isDisabled,
      ),
    [isDisabled, link, onClick, onDblClick, onMouseEnter, onMouseLeave],
  );

  const {
    hasBackgroundColor = false,
    hasBorderColor = false,
    hasBorderRadius = false,
    hasBorderWidth = false,
    hasColor = false,
    iconSvgString,
    iconCollapsed,
  } = corvid || {};

  // TODO hasError - seems to be static in wix-ui-santa
  const rootClassName = st(
    classes.root,
    {
      error: false,
      disabled: isDisabled,
      hasBackgroundColor,
      hasBorderColor,
      hasBorderRadius,
      hasBorderWidth,
      hasColor,
    },
    className,
  );

  let buttonIcon: ReactNode = null;
  let overrideIcon: boolean = false;
  // The null value in the iconSvgString indicates that iconSvgString is set in the Velo interface
  // and we have to hide any icon even there is the default value in svgString.
  // iconSvgString can be undefined - it means that it was not set in Velo.
  // Once iconSvgString is not null (from Velo) but undefined,
  // then show the default icon string if it is set
  if (!iconCollapsed && iconSvgString !== null) {
    if (iconSvgString) {
      buttonIcon = createIconFromString(iconSvgString);
      // this will prevent icon element from hiding by CSS rule
      // when the user set the button as text only but set up the icon property in Velo
      overrideIcon = true;
    } else if (svgString) {
      buttonIcon = createIconFromString(svgString);
    }
  }

  const renderLinkedButton = () => (
    <div
      id={id}
      {...eventHandlers}
      {...getQaDataAttributes(isQaMode, fullNameCompType)}
    >
      <Link
        {...link}
        {...a11yAttr}
        href={isDisabled ? undefined : link!.href}
        className={st(rootClassName, classes.link)}
      >
        <ButtonContent label={label} icon={buttonIcon} />
      </Link>
    </div>
  );

  const renderRegularButton = () => (
    // TODO - should we reuse some Button component for unity?
    <div id={id} {...getQaDataAttributes(isQaMode, fullNameCompType)}>
      <button
        type={type}
        disabled={isDisabled}
        className={rootClassName}
        data-testid={TestIds.buttonContent}
        {...a11yAttr}
        {...eventHandlers}
      >
        <ButtonContent
          label={label}
          icon={buttonIcon}
          override={overrideIcon}
        />
      </button>
    </div>
  );

  return isValidLink(link) ? renderLinkedButton() : renderRegularButton();
};

export default StylableButton;
