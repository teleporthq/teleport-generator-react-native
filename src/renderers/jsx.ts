import { ComponentGeneratorOptions } from '../types'

function parseForProps(content: any, isStyleObject?: boolean) {
  if (!content) return

  if (typeof content === 'string') {
    if (content.indexOf('$props.') === 0) {
      return `{${content.replace('$props.', 'this.props.')}}`
    } else {
      return `"${content}"`
    }
  } else {
    Object.keys(content).forEach((value) => {
      if (typeof content[value] === 'string') {
        if (content[value].indexOf('$props.') === 0) {
          content[value] = `\${${content[value].replace('$props.', 'this.props.')}}`
        }
      } else {
        parseForProps(content[value])
      }
    })

    if (isStyleObject) {
      return content
    }

    return isStyleObject ? content : `{${JSON.stringify(content)}}`
  }
}

export default function jsx(name: string, childrenJSX?: string, styleNames?: string[], props?: any, options?: ComponentGeneratorOptions): string {
  let styleNamesString = ''
  if (styleNames && Array.isArray(styleNames) && styleNames.length > 0) {
    styleNamesString = styleNames.length > 1 ? `style={[${styleNames.map((styleName) => `styles.${styleName}`).join(', ')}]}` : `style={styles.${styleNames}}`
  }

  const propsArray = []
  if (props) {
    Object.keys(props).map((propName) => {
      const propValue = parseForProps(props[propName])

      if (propValue) propsArray.push(`${propName}=${propValue}`)
    })
  }

  const propsString = propsArray.length ? ' ' + propsArray.join(' ') : ''

  if (childrenJSX && childrenJSX.length > 0) {
    return `
      <${name} ${styleNamesString} ${propsString}>
        ${childrenJSX}
      </${name}>
    `
  } else {
    return `<${name} ${styleNamesString} ${propsString}/>`
  }
}
