/**
 * Created by Sheldon Lee on 4/21/2017.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class RouterRedirect extends Component {
    componentDidUpdate() {
        if (this.props.path && this.props.location.pathname !== this.props.path) {
            this.props.history.push(this.props.path);
        }
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) {
    return {
        path: state.redirect.path
    }
}

export default withRouter(connect(mapStateToProps)(RouterRedirect))