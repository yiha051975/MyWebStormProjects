/**
 * Created by iti8218 on 1/19/2017.
 */
import React, { Component } from 'react';

class SearchBar extends Component{
    constructor(props) {
        super(props);
        this.state = {term: ''};
    }

    render() {
        return (
            <div>
                <input
                    value={this.state.term}
                    onChange={this.onInputChange.bind(this)} />
                Value of the input: {this.state.term}
            </div>
        );
    }

    onInputChange(e) {
        this.setState({term: e.target.value});
    }
}

export default SearchBar;