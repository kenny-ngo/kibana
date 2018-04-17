import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { set, del } from 'object-path-immutable';
import { ColorPickerMini } from '../../../components/color_picker_mini';
import { TooltipIcon } from '../../../components/tooltip_icon';

export const SimpleTemplate = props => {
  const { argValue, onValueChange, labels, workpad } = props;
  const chain = get(argValue, 'chain.0', {});
  const chainArgs = get(chain, 'arguments', {});
  const color = get(chainArgs, 'color.0', '');

  const handleChange = (argName, ev) => {
    const fn = ev.target.value === '' ? del : set;

    const newValue = fn(argValue, ['chain', 0, 'arguments', argName], [ev.target.value]);
    return onValueChange(newValue);
  };

  const handlePlain = (argName, val) => handleChange(argName, { target: { value: val } });

  return (
    <div className="canvas__argtype--seriesStyle--color">
      <label style={{ paddingRight: '4px' }}>Color </label>
      {!color || color.length === 0 ? (
        <div className="canvas__argtype--seriesStyle--color-picker">
          <div>
            <a onClick={() => handlePlain('color', '#000000')}>
              Auto <i className="fa fa-bolt" />
            </a>
          </div>
        </div>
      ) : (
        <div className="canvas__argtype--seriesStyle--color-picker">
          <div className="canvas__argtype--seriesStyle--remove-color">
            <i onClick={() => handlePlain('color', '')} className="fa fa-times-circle clickable" />
          </div>
          <ColorPickerMini
            value={color}
            onChange={val => handlePlain('color', val)}
            colors={workpad.colors}
          />
        </div>
      )}

      {(!labels || labels.length === 0) && (
        <div className="canvas__argtype--seriesStyle--color-warning">
          <TooltipIcon
            placement="left"
            icon="error"
            text="Data has no series to style, add a color dimension"
          />
        </div>
      )}
    </div>
  );
};

SimpleTemplate.displayName = 'SeriesStyleArgSimpleInput';

SimpleTemplate.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  argValue: PropTypes.any.isRequired,
  labels: PropTypes.array,
  workpad: PropTypes.shape({
    colors: PropTypes.array.isRequired,
  }).isRequired,
};
