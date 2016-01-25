import React, { Component, PropTypes }  from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";


export default class DragMap extends Component {

    dragEndHandler(e){
       let position = '{"lat":'+e.latLng.lat()+',"lng":'+e.latLng.lng()+'}';

        this.props.changeHandler(`${this.props.gridId}-solar-input${this.props.index}`, position);

    }

    render() {
        const { mainValue } = this.props;

        let DefaultPosition = {};
        if(mainValue === null){
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
                               draggable={true}
                                onDragend={this.dragEndHandler.bind(this)}
                             />

                       </GoogleMap>
        }
            />
        </section>
        return (
            <div>
                {myMap}
            </div>

        )
    }
}