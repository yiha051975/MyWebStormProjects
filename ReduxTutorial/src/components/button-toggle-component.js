/**
 * Created by Sheldon Lee on 1/24/2016.
 */
import React from 'react';

export default class ButtonToggleComponent extends React.Component {
    render() {
        console.log('This is in button-toggle-component');
        console.log(this.props);
        let buttonValue = this.props.isToggleOn ? 'ON' : "OFF";
        return (
            <div>
                <button type="button" className="buttontoggle-button" onClick={this.handleClick.bind(this)}>{buttonValue}</button>
            </div>
        )
    }

    handleClick(e) {
        console.log('The following node has been clicked:');
        console.log(e.target);
        console.log('Current value of the node is ' + e.target.innerHTML);
        console.log('Dispatching state and action....');
        /*this.props.dispatch(this.props.isToggleOn);*/
        this.props.onButtonClick(this.props.isToggleOn);
    }
}

ButtonToggleComponent.propTypes = {
    isToggleOn: React.PropTypes.bool.isRequired,
    onButtonClick: React.PropTypes.func.isRequired
};

/*ButtonToggleComponent.defaultProps = {
    isToggleOn: true,
    onButtonClick: function() {}
};*/
