import React, {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  InputHTMLAttributes,
} from 'react'
import classnames from 'classnames'
import './style.scss'

type NativeAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputProps>

export interface InputProps {
  nativeAttrs?: NativeAttrs
  className?: string
  clearable?: boolean
  hideNumberArrows?: boolean
  onChange?: (val: string | number) => void
  value?: string | number
  error?: string
  showErrorMessages?: boolean
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const {
    className,
    nativeAttrs,
    clearable,
    hideNumberArrows,
    value,
    onChange,
    error,
    showErrorMessages,
  } = props
  const rootClasses =
    classnames({
      input: true,
      'input--clearable': clearable,
      'input--hide-arrows': hideNumberArrows,
      'input--error': !!error,
    }) + ` ${className || ''}`

  const [val, setVal] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setVal(value || '')
  }, [value])

  const handleChange = (val: string | number) => {
    onChange && onChange(val)
    setVal(val)
  }

  return (
    <div className={rootClasses}>
      <input
        {...nativeAttrs}
        onChange={(e) => handleChange(e.target.value)}
        className="input__elem"
        value={val}
        ref={inputRef}
      />

      {showErrorMessages && error && <p className="input__error">{error}</p>}

      {clearable && val && (
        <button
          className="input__clear"
          title="Clear"
          onClick={(evt) => {
            evt.preventDefault()
            if (!inputRef.current?.disabled) {
              handleChange('')
            }
          }}
          type="button"
        ></button>
      )}
    </div>
  )
}
