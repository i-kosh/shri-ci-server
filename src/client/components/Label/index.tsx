import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import './style.scss'

export interface LabelProps {
  requiredMark?: boolean
  text: string
  onLeft?: boolean
}

export const Label: FunctionComponent<LabelProps> = (props) => {
  const rootClasses = classnames({
    label: true,
    'label--left': props.onLeft,
  })

  return (
    <label className={rootClasses}>
      <p className="label__text">
        <span className="label__text-val">{props.text}</span>
        {props.requiredMark && <span className="label__text-mark">*</span>}
      </p>
      <div className="label__content">{props.children}</div>
    </label>
  )
}
