import { Generator, ComponentCodeGenerator } from '@teleporthq/teleport-lib-js'

import DefaultRNComponentRenderer from './default'

export default class TeleportGeneratorReactNative extends Generator {
  constructor(name?: string, targetName?: string, customComponentRenderers?: { [key: string]: ComponentCodeGenerator }) {
    const componentRenderers = {
      default: new DefaultRNComponentRenderer(),
      ...customComponentRenderers,
    }

    super(name || 'react-native-generator', targetName || 'react-native', componentRenderers)
  }
}
