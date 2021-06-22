import { Input, InputProps } from '../Input'
import { Label, LabelProps } from '../Label'
import React, { FC } from 'react'

export interface InputWithLabelProps {
  labelProps: LabelProps
  inputProps: InputProps
}

export const InputWithLabel: FC<InputWithLabelProps> = (props) => {
  const { inputProps, labelProps } = props

  return (
    <Label {...labelProps}>
      <Input {...inputProps}></Input>
    </Label>
  )
}
