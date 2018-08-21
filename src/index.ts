import { Generator, FileSet } from "@teleporthq/teleport-lib-js";
import RNComponentGenerator from "./generators/component";
import RNProjectGenerator from "./generators/project";

type GeneratorPlugin = (output: string) => string;

export default class TeleportGeneratorRN extends Generator {
  public componentGenerator: RNComponentGenerator;
  public projectGenerator: RNProjectGenerator;
  public plugins: {
    [key: string]: GeneratorPlugin;
  } = {};

  constructor() {
    super("react-native-generator", "react-native");

    this.componentGenerator = new RNComponentGenerator(this);
    this.projectGenerator = new RNProjectGenerator(
      this,
      this.componentGenerator
    );
  }

  public generateComponent<T, U>(component: T, options: U): FileSet {
    return this.componentGenerator.generate(component, options);
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options);
  }

  public usePlugin(pluginName: string, plugin: GeneratorPlugin) {
    if (this.plugins[pluginName])
      throw new Error(
        `Plugin has \`${pluginName}\` has already been registered`
      );

    this.plugins[pluginName] = plugin;
  }
}
