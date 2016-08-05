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
 * @return {Component} Wrapped component
 */
function translatable(Component) {

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

  return mobxReact.inject(config.injectFn)(mobxReact.observer(Component));
}

module.exports = {
  init: init,
  translatable: translatable
}
