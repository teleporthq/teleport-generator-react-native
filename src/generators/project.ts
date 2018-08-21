import { ProjectGenerator, Generator, FileSet } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorNext from '../index'
import packageRenderer from '../renderers/package'
import RNComponentGenerator from './component'

export default class RNProjectGenerator extends ProjectGenerator {
  public componentGenerator: RNComponentGenerator

  constructor(generator: TeleportGeneratorNext, componentGenerator: RNComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  public getHtmlHeadItemAttributes(attributes) {
    const attributesStrings = []
    Object.keys(attributes).forEach((attributeName) => {
      attributesStrings.push(`${attributeName}="${attributes[attributeName]}"`)
    })
    return attributesStrings.join(' ')
  }

  public generate(project: any, options: any = {}): FileSet {
    const { components, pages } = project

    const result = new FileSet()
    const pkg = packageRenderer(project)

    result.addFile('package.json', pkg)

    if (components) {
      Object.keys(components).map((componentName) => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component)
        componentResults.getFileNames().map((fileName) => {
          result.addFile(`components/${fileName}`, componentResults.getContent(fileName))
        })
      })
    }

    if (pages) {
      Object.keys(pages).map((pageName) => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page, {
          isPage: true,
        })
        pageResults.getFileNames().map((fileName) => {
          result.addFile(`screens/${fileName}`, pageResults.getContent(fileName))
        })
      })
    }

    return result
  }
}
