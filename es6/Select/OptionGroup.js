var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { default as Component } from '../Common/plugs/index.js'; //提供style, classname方法

var OptionGroup = function (_Component) {
  _inherits(OptionGroup, _Component);

  function OptionGroup() {
    _classCallCheck(this, OptionGroup);

    return _possibleConstructorReturn(this, (OptionGroup.__proto__ || Object.getPrototypeOf(OptionGroup)).apply(this, arguments));
  }

  _createClass(OptionGroup, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'ul',
        { style: this.style(), className: this.className('ishow-select-group__wrap') },
        React.createElement(
          'li',
          { className: 'ishow-select-group__title' },
          this.props.label
        ),
        React.createElement(
          'li',
          null,
          React.createElement(
            'ul',
            { className: 'ishow-select-group' },
            this.props.children
          )
        )
      );
    }
  }]);

  return OptionGroup;
}(Component);

export default OptionGroup;


OptionGroup.propTypes = {
  label: PropTypes.string
};