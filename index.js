var React = require('react');
var mobxReact = require('mobx-react');
var I18n = require('i18n-harmony');

function defaultInjectFn(stores) {
  return {
    i18n: stores.i18n
  };
}

var config = {
  injectFn: defaultInjectFn
};

function init(injectFn) {
  config.injectFn = injectFn || defaultInjectFn;
}

/**
 * Wrap a React Component in order to make it translatable (decorator)
 *
 * @param  {Component} Component - Component to be wrapped
 * @param {String[]} [connect=undefined] - Connect store to the component
 * @return {Component} Wrapped component
 */
function translatable(Component, connect) {

  /* istanbul ignore if */
  if (Component.propTypes) {
    Component.propTypes.i18n = React.PropTypes.object;
  } else {
    Component.propTypes = {
      i18n: React.PropTypes.object
    };
  }

  Component.prototype.t = function(key, opts) {
    var i18n = this.props.i18n;

    // Third argument is the locale that should be used
    // We can't use the active one because of the SSR and shared I18n state
    // Also, we need to observe i18n.locale to detect changes, so this is useful
    return I18n.t(key, opts, i18n.locale);
  };

  Component.prototype.has = function(key, opts, includeDefault = false) {
    var i18n = this.props.i18n;

    // Forth argument is the locale that should be used
    // We can't use the active one because of the SSR and shared I18n state
    // Also, we need to observe i18n.locale to detect changes, so this is useful
    return I18n.has(key, opts, includeDefault, i18n.locale);
  };

  var observed = connect
    ? mobxReact.observer(connect)(Component)
    : mobxReact.observer(Component);
  return mobxReact.inject(config.injectFn)(observed);
}

module.exports = {
  init: init,
  translatable: function(arg) {
    if (arg instanceof Array) {
      return function(Component) {
        return translatable(Component, arg);
      }
    }
    return translatable(arg);
  }
}
