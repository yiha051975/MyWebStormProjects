/**
 * Created by Sheldon Lee on 1/24/2016.
 */
import React from 'react';
import guid from '../guid/guid.js';

export default class ButtonToggleComponent extends React.Component {

    componentWillMount() {
        this.componentId = guid();
    }

    render() {
        let isToggleOn = this.props.isToggleOn(this.componentId);
        this.isToggleOn = isToggleOn;
        let buttonValue = isToggleOn ? 'ON' : "OFF";
        return (
            <div>
                <button type="button" className="buttontoggle-button" onClick={this.handleClick.bind(this)}>{buttonValue}</button>
            </div>
        )
    }

    handleClick(e) {
        this.props.onButtonClick(this.isToggleOn, this.componentId);
    }
}

ButtonToggleComponent.propTypes = {
    isToggleOn: React.PropTypes.func.isRequired,
    onButtonClick: React.PropTypes.func.isRequired
};

/*ButtonToggleComponent.defaultProps = {
    isToggleOn: true,
    onButtonClick: function() {}
};*/
