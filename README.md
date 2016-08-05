# react-mobx-translatable

Make React components translatable using MobX. Can be used both on the server (SSR) and in the browser.

Note: This plugin depends on ``mobx-react`` features that are currently marked as experimental: ``Provider`` and ``inject``.

## Usage

### Checklist (see the example for more details)

* Setup the i18n object in store
* Initialize the [i18n-harmony lib](https://github.com/DarkoKukovec/i18n-harmony) and translatable
* Wrap your components with ``Provider`` component
* Set the ``@translatable`` decorator on your components
* Call ``this.t(translationKey, options)`` from the component
* To change the language, change the locale variable in the store

### Methods

#### init(injectFn)

Method receives ``injectFn`` - function that maps the i18n object from the store
* The function receives the whole store object (from ``Provider``)
* The function should return an object that contains an ``i18n`` key with the i18n object from store (see the example)
* Default: ``(store) => {i18n: i18n.store}``
* If you have the i18n object in the root of the store (the default function can map the value), you don't need to call ``init``

#### translatable(Component)

Method receives a component that should be decorated and returns the wrapped component. Translatable decorator is also making the Component an observer.

Note: If using with other decorators, ``translatable`` should be the innermost.

## Example

The example assumes you're using the following:
* [ES2015](https://babeljs.io/docs/plugins/preset-es2015/)
* [object rest spread](http://babeljs.io/docs/plugins/transform-object-rest-spread/)
* [decorators](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy)

This is however not a requirement.

### Initialize store, i18n, and translatable

    import {observable} from 'mobx';
    import i18n from 'i18n-harmony';
    import {init} from 'translatable';

    const defaultLocale = 'en'; // Can be based on browser language or user selection (localStorage, cookies)

    const store = {
      i18n: observable({locale: defaultLocale})
    };

    // For details, see i18n-harmony: https://github.com/DarkoKukovec/i18n-harmony
    i18n.init({
      translations: {
        en: {hello: 'Hello world!'}
      }
    });

    init((store) => ({i18n: store.i18n}));

### Wrap your React components inside of the ``Provider`` componentand pass it the store

    import {Provider} from 'mobx-react';
    import store from './store';

    ReactDOM.render(<Provider {...store}>
      <Router {...renderProps} />
    </Provider>, document.getElementById('app'));

### Translatable component

    import {Component} from 'react';
    import {translatable} from 'translatable';

    export default class MyComponent extends Component {
      render() {
        return <div>{this.t('hello')}</div>
      }
    }

## License
[MIT License](LICENSE)
