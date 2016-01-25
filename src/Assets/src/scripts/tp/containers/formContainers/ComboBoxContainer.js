import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../../actions/comboBox'
import {save, edit, update} from "../../api/"
import Window from "../../components/form/window/"


class ComboBoxContainer extends Component {

    componentWillMount() {


    }
    componentWillUnmount(){

    }
    render() {

        const {  } = this.props;




        return (
            <div className="">



            </div>

        )
    }
}

ComboBoxContainer.defaultProps = {
    setup: {},
    formControls: []
}
ComboBoxContainer.propTypes = {
    setup: PropTypes.object.isRequired,
    formControls: PropTypes.array.isRequired
}

function mapStateToProps(state) {

    const ComboBox = state.ComboBox;

    return {
        showAddModal: ComboBox.get('showAddModal')
    }
}
// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {

    return {
        actions: bindActionCreators(DataActions, dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ComboBoxContainer)
