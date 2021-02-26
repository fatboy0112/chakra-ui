import { isNumber } from "@chakra-ui/utils"
import type { ThemeScale } from "./css-var"
import type { Transform } from "./types"

const analyzeCSSValue = (value: number | string) => {
  const num = parseFloat(value.toString())
  const unit = value.toString().replace(String(num), "")
  return { unitless: !unit, value: num, unit }
}

export const px = (value: number | string): string => {
  if (value == null) return value
  const { unitless } = analyzeCSSValue(value)
  return unitless || isNumber(value) ? `${value}px` : value
}

interface CreateTransformOptions {
  scale: ThemeScale
  compose?: Transform
  transform?: Transform
}

export function createTransform(options: CreateTransformOptions) {
  const { scale, transform, compose } = options

  const fn: Transform = (value, theme) => {
    const valueStr = String(value)
    const key = scale ? `${scale}.${valueStr}` : valueStr
    const _value = key in theme.__cssMap ? theme.__cssMap[key].varRef : value
    let result = transform?.(_value, theme) ?? _value
    if (compose) {
      result = compose(result, theme)
    }
    return result
  }

  return fn
}
