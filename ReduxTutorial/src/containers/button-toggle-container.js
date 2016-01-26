/**
 * Created by Sheldon Lee on 1/24/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import ButtonToggleComponent from '../components/button-toggle-component.js';
import {toggleButton} from '../redux/actions/action-creator.js';

class ButtonToggleContainer extends React.Component {
    componentDidMount() {

    }

    render() {
        console.log('This is in button-toggle-container');
        console.log(this.props);
        const {dispatch} = this.props;
        return (
            <div>
                <ButtonToggleComponent isToggleOn={this.props.isToggleOn} onButtonClick={isToggleOn => dispatch(toggleButton(isToggleOn))}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isToggleOn: state.buttonToggleReducer.isToggleOn
    };
}

export default connect(mapStateToProps)(ButtonToggleContainer);
