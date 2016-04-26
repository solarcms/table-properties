import React, { Component, PropTypes }  from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";


export default class DragMap extends Component {

    dragEndHandler(e){
       let position = '{"lat":'+e.latLng.lat()+',"lng":'+e.latLng.lng()+'}';

        this.props.changeHandler(position);

    }

    render() {
        const { mainValue, fieldClass, placeholder, errorText, disabled, dataIndex, fieldClassName } = this.props;

        const canDrag = disabled == true ? false : true;

        let DefaultPosition = {};
        if(mainValue === null || mainValue === ''){
            DefaultPosition = {lat: 47.919088, lng: 106.917888}
        } else {

            DefaultPosition = JSON.parse(mainValue)

        }

        const myMap = <section style={{height: "300px"}}>
            <GoogleMapLoader
                containerElement={
                      <div
                        {...this.props}
                        style={{
                          height: "300px",
                        }}
                      />
        }
                googleMapElement={
                      <GoogleMap
                        defaultZoom={12}
                        defaultCenter={DefaultPosition}
                        >

                        <Marker
                               position={DefaultPosition}
                               draggable={canDrag}
                                onDragend={this.dragEndHandler.bind(this)}
                             />

                       </GoogleMap>
        }
            />
        </section>
        return (

            <div  className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${dataIndex}`}>
                <label className="control-label">{placeholder}</label>
                <div>
                    {myMap}
                </div>
                <span className="help-block">

                    {errorText}
                </span>
            </div>



        )
    }
}
