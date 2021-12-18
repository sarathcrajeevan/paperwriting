import React, { ChangeEventHandler } from 'react';
import styles from './Input.scss';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import { Tooltip } from 'wix-ui-tpa/Tooltip';
import { ReactComponent as CheckSuccess } from 'wix-ui-tpa/dist/src/assets/icons/CheckSuccess.svg';
import { ReactComponent as Error } from 'wix-ui-tpa/dist/src/assets/icons/Error.svg';
import { TooltipSkin } from 'wix-ui-tpa/dist/src/components/Tooltip/TooltipEnums';

const textAreaMaxLength = 80;
interface InputProps {
  label: string;
  value: string;
  valid: boolean;
  error?: string;
  onBlur(): any;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  dataHook: string;
  type: string;
  autoFocus: boolean;
  color?: string;
  background: string;
  inputRef?(el): void;
}

const Input: React.FunctionComponent<InputProps> = ({
  label,
  value,
  valid,
  error,
  onBlur,
  onChange,
  dataHook,
  type,
  autoFocus,
  color,
  background,
  inputRef,
}) => {
  const [count, setCount] = React.useState(0);
  const [focus, setFocus] = React.useState(false);

  return (
    <div className={styles.container} data-hook={dataHook}>
      <div
        className={classNames({
          [styles.input]: true,
          [styles.dirty]: !!value,
          [styles.invalid]: !valid,
          [styles.focused]: focus,
        })}
      >
        {type !== 'message' ? (
          <input
            autoComplete="off"
            aria-describedby={`${type}-error`}
            id={type}
            name={type}
            type="text"
            onBlur={() => {
              setFocus(false);
              onBlur();
            }}
            onChange={onChange}
            aria-required={true}
            aria-invalid={!valid}
            autoFocus={autoFocus}
            onFocus={() => setFocus(true)}
            style={{ background, color }}
            ref={inputRef}
          />
        ) : (
          <div>
            {count > 0 && (
              <span className={styles.counter} data-hook={`${type}-counter`}>
                {count}/{textAreaMaxLength}
              </span>
            )}
            <Textarea
              id={type}
              name={type}
              onBlur={() => {
                setFocus(false);
                onBlur();
              }}
              onChange={(e) => {
                setCount(e.target.value.length);
                onChange(e);
              }}
              maxRows={5}
              autoFocus={autoFocus}
              maxLength={textAreaMaxLength}
              onFocus={() => setFocus(true)}
              style={{ background, color }}
            />
          </div>
        )}
        <label id={`${type}-label`} htmlFor={type} data-hook="label">
          {label}
        </label>
      </div>
      {!valid ? (
        <div
          id={`${type}-error`}
          data-hook="error"
          className={styles.error}
          role="alert"
        >
          <span className={styles.srOnly}>{error}</span>
          <Tooltip
            data-hook={`${type}-error-tooltip`}
            appendTo="window"
            skin={TooltipSkin.Error}
            content={
              <div
                style={{ textAlign: 'center' }}
                data-hook={`${type}-error-text`}
              >
                {error}
              </div>
            }
            placement={'top'}
            moveBy={{ y: 4, x: -80 }}
            maxWidth={210}
          >
            <Error style={{ stroke: color }} />
          </Tooltip>
        </div>
      ) : (
        value && (
          <div id={`${type}-valid`} data-hook="valid" className={styles.valid}>
            <CheckSuccess style={{ fill: color }} />
          </div>
        )
      )}
    </div>
  );
};

export default Input;
