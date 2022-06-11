# use-lazy-module-federation

## 1.Reason

This project is to make Micro FE with [Module Federation](https://webpack.js.org/concepts/module-federation/) become easier to use

This project was inspire from this sample to load dynamic remote module [advanced-api/dynamic-remotes](https://github.com/module-federation/module-federation-examples/blob/60d3ca04454a3f356cc54c04599de3501373ce1a/advanced-api/dynamic-remotes/app1/src/App.js) from [Creator of Module Federation](https://github.com/ScriptedAlchemy)

But it's still complex to understand all the mechanism to load remote module, so I create this hook to wrap that complex mechanism



## 2.Setup Module Federation
- To use Module Federation, you webpack version must >= 5
### 2.1.If your project running in webpack
- go to `webpack.config.js`
- add these config to `plugins` part:
```

const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

module.exports = {
  // ... 
  plugins: [
    // ... 
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      shared: [
        {
          react: { singleton: true, eager: true },
          "react-dom": { singleton: true, eager: true }
        }
      ]
    }),
  ],

};

```

### 2.2.If your project running in cra
- install react-app-rewired `yarn add -D react-app-rewired`
- `react-app-rewired` will merge your override config with the default webpack config from cra and you can inject your additional settings
- add file `config-overrides.js` with these content:

```
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin

module.exports = function override(config, env) {
  config.plugins = config.plugins || []
  
  config.plugins.push(
    new ModuleFederationPlugin({
      name: "home",
      filename: "remoteEntry.js",
      shared: [
        {
          react: { singleton: true, eager: true },
          "react-dom": { singleton: true, eager: true }
        }
      ]
    }),
  )

  return config;
}

```
- adjust your running script, replace `react-scripts` with `react-app-rewired`
```
 "scripts": {
    "dev": "react-app-rewired start",
    "build": "react-app-rewired build",
    "start": "serve -s build -l 3000",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```
## 3.Setup this hook and complete setup
```
yarn add -D use-lazy-module-federation
```

## 4.Coding
```
import { useLazyModuleFederation } from "use-lazy-module-federation";

type RemoteComponentProps = {
  title?: string
}

export default function Container() {
  const { Component: RemoteComponent, errorLoading } = useLazyModuleFederation<RemoteComponentProps>({  
    url: 'http://localhost:3003/remoteEntry.js',
    scope: 'app3',
    module: './Widget',
  });

  return (
    <>
      <Suspense fallback="Loading System">
        {errorLoading
          ? `Error loading module "${module}"`
          : RemoteComponent && <RemoteComponent title="hello" />}
      </Suspense>
    </>
  )

}
```

## Demo 
[example here](https://github.com/moneyforwardvietnam/use-lazy-module-federation-example)