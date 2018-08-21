import styleTransformers from "@teleporthq/teleport-lib-js/dist/transformers/styles";
const { jsstocss } = styleTransformers;
import transform from "css-to-react-native-transform";

const renderDependency = (libraryName, types) => {
  // there can be only one default import;
  // if multiple, the last one will be used;
  // @todo: discuss how to handle the case where multiple default imports are present
  let defaultType = null;
  const deconstructedTypes = [];
  if (Array.isArray(types) && types.length > 0) {
    types.map(type => {
      // if the type is a string
      if (typeof type === "string") {
        // and it is from components
        if (
          libraryName.indexOf("../components") === 0 ||
          libraryName.indexOf("./") === 0
        ) {
          // treat it as a default import
          defaultType = type;
        } else {
          // otherwise add it to the deconstruction imports
          deconstructedTypes.push(type);
        }
      } else {
        if (type.defaultImport) {
          defaultType = type.type;
        } else {
          deconstructedTypes.push(type.type);
        }
      }
    });
  }

  const importArray = [];
  if (defaultType) importArray.push(defaultType);
  if (deconstructedTypes.length > 0) {
    importArray.push(`{ ${deconstructedTypes.join(", ")} }`);
  }

  return `import ${importArray.join(", ")} from '${libraryName}'`;
};

export default function component(
  name: string,
  jsx: string,
  dependencies: any = {},
  props,
  styles
): any {
  const dependenciesArray = Object.keys(dependencies).map(libraryName =>
    renderDependency(libraryName, dependencies[libraryName])
  );

  let propsString = "";
  if (props && props.length > 0) {
    propsString = `\n    const { ${props.join(", ")} } = this.props`;
  }

  // tslint:disable-next-line:no-console
  const css = jsstocss.stylesheet(styles).css;
  const reactNativeStyles = transform(css);
  let reactNativeStylesString = JSON.stringify(reactNativeStyles, null, 4);
  reactNativeStylesString.replace(/\\"/g, "\uFFFF");
  reactNativeStylesString = reactNativeStylesString
    .replace(/\"([^"]+)\":/g, "$1:")
    .replace(/\uFFFF/g, '\\"');

  return `import React, { Component } from 'react'
${dependenciesArray.join(`\n`)}

export default class ${name} extends Component {
  render () {${propsString}
    return (${jsx}
    )
  }
}
const styles = StyleSheet.create(${reactNativeStylesString})
`;
}
