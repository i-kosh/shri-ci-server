import React, { FunctionComponent } from 'react'
import { Label, LabelProps } from '../Label'
import { Input, InputProps } from '../Input'
import './style.scss'

export interface InputShortProps {
  labelProps: LabelProps
  inputProps?: InputProps
  valName?: string
}

export const InputShort: FunctionComponent<InputShortProps> = (props) => {
  return (
    <div className="input-short">
      <Label {...props.labelProps}>
        <div className="input-short__content">
          <div className="input-short__input">
            <Input {...props.inputProps} />
          </div>
          {props.valName && (
            <div className="input-short__val">{props.valName}</div>
          )}
        </div>
      </Label>
    </div>
  )
}
