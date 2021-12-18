import React, { ReactElement } from 'react';
import classNames from 'classnames';
import styles from './Header.scss';
import { ReactComponent as Close } from '../../assets/icons/header/close.svg';
import { ReactComponent as Arrow } from '../../assets/icons/header/arrow.svg';
import { getRgbA } from '../../services/colors';
import { useAppState } from '../../hooks/app-state';
export interface HeaderProps {
  title: string;
  subtitle?: string;
  onlineIndicator?: boolean;
  imageUrl?: string;
  imageSvg?: ReactElement;
  textColor: string;
  backgroundColor: string;
  font?: string;
  onClose?(): void;
  closeButtonLabel?: string;
  onBack?(): void;
  onButtonClick?(): void;
  buttonLabel?: React.ReactNode;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  title,
  subtitle,
  onlineIndicator,
  imageUrl,
  imageSvg,
  textColor,
  backgroundColor,
  font,
  onClose,
  closeButtonLabel,
  onBack,
  onButtonClick,
  buttonLabel,
}) => {
  const { withQab: isEditorX } = useAppState().appState;
  const withImage = imageUrl || imageSvg;

  const onlineIndicatorComponent = onlineIndicator ? (
    <div
      data-hook="online-indicator"
      className={styles.onlineIndicator}
      style={{
        borderColor: backgroundColor,
      }}
    />
  ) : undefined;

  const imageComponent = withImage ? (
    <div data-hook="image-wrapper" className={styles.imageWrapper}>
      {imageUrl && (
        <img
          className={styles.image}
          data-hook="image"
          src={imageUrl}
          style={{ borderColor: getRgbA(textColor, 0.05) }}
        />
      )}
      {imageSvg ? imageSvg : undefined}
      {onlineIndicatorComponent}
    </div>
  ) : undefined;

  const subtitleComponent = subtitle ? (
    <div data-hook="subtitle-wrapper" className={styles.subtitleWrapper}>
      {!withImage && onlineIndicatorComponent}
      <span data-hook="subtitle" className={styles.subtitle}>
        {subtitle}
      </span>
    </div>
  ) : undefined;

  return (
    <div
      data-hook="header"
      className={classNames(styles.header, {
        [styles.mobile]: isEditorX,
      })}
      style={{
        color: textColor,
        backgroundColor,
      }}
    >
      {onBack && (
        <button
          className={styles.backButton}
          data-hook="back-button"
          onClick={onBack}
        >
          <Arrow width="14px" height="8px" />
        </button>
      )}
      {imageComponent}
      <div className={styles.content}>
        <h2
          data-hook="title"
          className={styles.title}
          style={{
            fontFamily: font,
          }}
        >
          {title}
        </h2>
        {subtitleComponent}
      </div>
      {onButtonClick && (
        <button
          data-hook="custom-button"
          className={styles.customButton}
          onClick={onButtonClick}
          style={{
            fontFamily: font,
          }}
        >
          {buttonLabel}
        </button>
      )}
      {onClose && (
        <button
          data-hook="close-button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label={closeButtonLabel}
        >
          <Close />
        </button>
      )}
    </div>
  );
};
