import React, { Component, PropTypes } from 'react'
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux'
import * as DataActions from '../actions/'
import Header from '../components/grid/Header'
import Form from "../components/form/page_add_edit/Form"
import validation from "../components/form/validation/"
import {save, edit, update} from "../api/"

class AddEditContainer extends Component {

    saveForm(){
        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(index, error);
                foundError = true;
            }

        })

        if(foundError === false)
            save(FD).done((data)=>{

                if(data == 'success'){
                    this.props.actions.clearFromValidation();
                    window.location.replace('#/');
                }

            }).fail(()=>{
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }

    updateForm(){

        const FD = this.props.formControls;

        let foundError = false;

        FD.map((fromColumn, index) => {
            const error = (validation(fromColumn.value, fromColumn.validate));
            if(error){
                this.props.actions.setError(index, error);
                foundError = true;
            }

        })

        if(foundError === false)
            update(FD, this.props.params.id).done((data)=>{

                if(data == 'success' || 'none'){
                    this.props.actions.clearFromValidation();
                    window.location.replace('#/');
                }

            }).fail(()=>{
                alert("Уучлаарай алдаа гарлаа дахин оролдоно уу")
            })

    }
    // form field value recieve functions
    changeValues(e){

        const index = e.target.name.replace("solar-input", "");
        const value = e.target.value;

        const FD = this.props.formControls;

        e.target.type == 'checkbox' ?
            this.props.actions.chagenValue(index, e.target.checked)
        :
            this.props.actions.chagenValue(index, value)


        // check validation with on change
        const error = (validation(value, FD[index].validate));
        this.props.actions.setError(index, error);

    }
    componentWillMount() {

        //clear form validation
        const FC = this.props.formControls;

        if(FC.length >= 1)
            this.props.actions.clearFromValidation();

        if(this.props.params.id){
            edit(this.props.params.id).then((data)=> {
                if(data.length >= 1)
                    this.props.formControls.map((formControl, index)=>{
                        this.props.actions.chagenValue(index, data[0][formControl.column])
                    })
                else
                    alert('please try agian')
            });
        }




    }

    render() {

        const { setup, formControls, formData, focusIndex } = this.props;

        return (
            <div className="card">
                <Header pageName={setup.page_name} icon="fa fa-chevron-left" link="#/" type="addEdit"

                       />
                <div>
                    <div className="row p-h-lg" >
                        <div className="col-md-12 col-lg-12 col-sm-12">
                            <div className="form-horizontal solar-form" >

                                <Form formControls={formControls} formData={formData} ref="fromRefs" focusIndex={focusIndex}

                                      changeHandler={this.changeValues.bind(this)}
                                />

                                <div>
                                    {this.props.params.id
                                        ? <button type="button" className="btn btn-success p-h-lg" onClick={this.updateForm.bind(this)}>
                                                <i className="fa fa-check"></i>

                                            </button>
                                        :
                                            <button type="button" className="btn btn-success p-h-lg" onClick={this.saveForm.bind(this)}>
                                                <i className="fa fa-check"></i>

                                            </button>
                                    }

                                    &nbsp;
                                    <a href="#/" className="btn btn-danger p-h-lg">
                                        <i className="fa fa-times"></i>
                                    </a>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>
            </div>

        )
    }
}

AddEditContainer.defaultProps = {
    setup: {},
    formControls: []
}
AddEditContainer.propTypes = {
    setup: PropTypes.object.isRequired,
    formControls: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    const TpStore = state.TpStore;
    return {
        setup: TpStore.get('setup').toJS(),
        focusIndex: TpStore.get('focusIndex'),
        formData: TpStore.get('formData').toJS(),
        formControls: TpStore.get('setup').toJS().form_input_control,
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
)(AddEditContainer)
