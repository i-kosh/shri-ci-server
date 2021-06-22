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
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  prepend,
  btnStyle,
  size,
  tag,
  className,
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
    }) + ` ${className || ''}`

  return createElement<NativeAttrs & ButtonProps>(
    tag || 'button',
    {
      className: rootClasses,
      ...nativeAttrs,
    },
    <>
      {prepend && <div className="button__prepend">{prepend}</div>}

      <div className="button__content">{children}</div>
    </>
  )
}
