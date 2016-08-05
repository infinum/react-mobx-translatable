const {expect} = require('chai');
const {describe, it} = require('mocha');
const {mount} = require('enzyme');

const React = require('react');
const {Provider} = require('mobx-react');
const {observable} = require('mobx');
const i18n = require('i18n-harmony');
const {jsdom} = require('jsdom');

const {init, translatable} = require('./index');

const exposedProperties = ['window', 'navigator', 'document'];

function initMockDOM() {
  global.document = jsdom('');
  global.window = document.defaultView;
  Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
      exposedProperties.push(property);
      global[property] = document.defaultView[property];
    }
  });

  global.navigator = {
    userAgent: 'node.js'
  };
}

describe('react-mobx-translatable', function() {
  beforeEach(function() {
    i18n.init({
      translations: {
        en: {hello: 'Hello'},
        de: {hello: 'Hallo'}
      }
    });
    initMockDOM();
  });

  it('should work with default configuration', function() {
    const store = {
      i18n: observable({locale: 'en'})
    };
    init();

    class MyComponent extends React.Component {
      render() {
        return <div>{this.t('hello')}</div>;
      }
    }
    const MyWrappedComponent = translatable(MyComponent);

    const wrapper = mount(<Provider {...store}><MyWrappedComponent /></Provider>);

    expect(wrapper.find('div').first().text()).to.equal('Hello');

    store.i18n.locale = 'de';
    expect(wrapper.find('div').first().text()).to.equal('Hallo');
  });

  it('should work with custom store configuration', function() {
    const store = {
      ui: {
        i18n: observable({locale: 'en'})
      }
    };
    init((store) => ({i18n: store.ui.i18n}));

    class MyComponent extends React.Component {
      render() {
        return <div>{this.t('hello')}</div>;
      }
    }
    const MyWrappedComponent = translatable(MyComponent);

    const wrapper = mount(<Provider {...store}><MyWrappedComponent /></Provider>);

    expect(wrapper.find('div').first().text()).to.equal('Hello');

    store.ui.i18n.locale = 'de';
    expect(wrapper.find('div').first().text()).to.equal('Hallo');
  });
});
