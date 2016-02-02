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

    isToggleOn(componentId) {
        if (undefined !== this.props.buttonToggleReducer && this.props.buttonToggleReducer[componentId]) {
            return this.props.buttonToggleReducer[componentId].isToggleOn;
        } else {
            return true;
        }
    }

    render() {
        const {dispatch} = this.props;
        return (
            <div>
                <ButtonToggleComponent isToggleOn={this.isToggleOn.bind(this)} onButtonClick={(isToggleOn, componentId) => dispatch(toggleButton(isToggleOn, componentId))}/>
                <ButtonToggleComponent isToggleOn={this.isToggleOn.bind(this)} onButtonClick={(isToggleOn, componentId) => dispatch(toggleButton(isToggleOn, componentId))}/>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    /*return {
        isToggleOn: state.buttonToggleReducer.isToggleOn
    };*/
    return state;
}

export default connect(mapStateToProps)(ButtonToggleContainer);
