import React, {
  createElement,
  FunctionComponent,
  ReactNode,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'
import classnames from 'classnames'
import './style.scss'

type NativeAttrs =
  | AnchorHTMLAttributes<HTMLAnchorElement>
  | ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonProps {
  prepend?: ReactNode
  btnStyle?: 'accent' | 'default' | 'clear'
  size?: 'md' | 'sm' | 'xs'
  tag?: 'a' | 'button'
  className?: string
  nativeAttrs?: NativeAttrs
  disabled?: boolean
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  prepend,
  btnStyle,
  size,
  tag,
  className,
  disabled,
  nativeAttrs,
}) => {
  const rootClasses =
    classnames({
      button: true,
      'button--accent': btnStyle === 'accent',
      'button--clear': btnStyle === 'clear',
      'button--prepended': !!prepend,
      'button--sm': size === 'sm',
      'button--xs': size === 'xs',
      'button--disabled': disabled,
    }) + ` ${className || ''}`

  return createElement<NativeAttrs & ButtonProps>(
    tag || 'button',
    {
      className: rootClasses,
      ...nativeAttrs,
      disabled,
      tabIndex: disabled ? -1 : undefined,
    },
    <>
      {prepend && <div className="button__prepend">{prepend}</div>}

      <div className="button__content">{children}</div>
    </>
  )
}
