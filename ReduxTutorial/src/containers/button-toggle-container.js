/**
 * Created by Sheldon Lee on 1/24/2016.
 */
import React from 'react';
import {connect} from 'react-redux';
import ButtonToggleComponent from '../components/button-toggle-component.js';
import {toggleButton} from '../redux/actions/action-creator.js';
import guid from '../guid/guid.js';

class ButtonToggleContainer extends React.Component {

    /**
     * This will be fired only once before the render method being called
     * In this case, it is creating a unique id for this instance of
     * ButtonToggleContainer
     */
    componentWillMount() {
        this.containerId = guid();
    }

    componentDidMount() {

    }

    isToggleOn(state) {
        if (undefined !== state && state[this.containerId]) {
            return state[this.containerId].isToggleOn;
        } else {
            return true;
        }
    }

    render() {
        //if (!this.containerId) {
        //    this.containerId = guid();
        //}
        console.log('This is in button-toggle-container');
        console.log(this.props);
        const {dispatch} = this.props;
        return (
            <div>
                <ButtonToggleComponent isToggleOn={this.isToggleOn(this.props.buttonToggleReducer)} onButtonClick={isToggleOn => dispatch(toggleButton(isToggleOn, this.containerId))}/>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    /*return {
        isToggleOn: state.buttonToggleReducer.isToggleOn
    };*/
    console.log(props);
    return state;
}

export default connect(mapStateToProps)(ButtonToggleContainer);
