import React, { Component, PropTypes }  from 'react';
import DropzoneComponent from "react-dropzone-component";
import $ from 'jquery'

export default class SingleFileUploader extends Component {
    uploadSuccess(e, responsejson){

        if(e.status == 'success')
            this.props.changeHandler(`${this.props.gridId}-solar-input${this.props.index}`, '{"originalName":"'+e.name+'","path": "/uploads/'+responsejson+'", "thumbPath":"/uploads/thumbs'+responsejson+'"}');
        else
            alert('error please try again')
    }

    removeImage(e){

        console.log(e.name)
        console.log(e)
    }

    render() {
        const { mainValue } = this.props;

        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,

            postUrl: '/solar/tp/single-upload'
        };
        const djsConfig = {
            addRemoveLinks: true,
            uploadMultiple:false,
            maxFiles:1,
            dictRemoveFile: 'Remove/Устгах',
            params: {
                test: "test 2"

            },
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
        };

        const eventHandlers = {
            // This one receives the dropzone object as the first parameter
            // and can be used to additional work with the dropzone.js
            // object
            init: null,

            dragstart: null,
            dragend: null,
            dragenter: null,
            dragover: null,
            dragleave: null,
            // All of these receive the file as first parameter:
            addedfile: null,
            removedfile: this.removeImage.bind(this),
            thumbnail: null,
            error: null,
            processing: null,
            uploadprogress: null,
            sending: null,
            success: this.uploadSuccess.bind(this),
            complete: null,
            canceled: null,
            maxfilesreached: null,
            maxfilesexceeded: null,
            // All of these receive a list of files as first parameter
            // and are only called if the uploadMultiple option
            // in djsConfig is true:
            processingmultiple: null,
            sendingmultiple: null,
            successmultiple: null,
            completemultiple: null,
            canceledmultiple: null,
            // Special Events
            totaluploadprogress: null,
            reset: null,
            queuecomplete: null
        }

        return (
            <div>
                <DropzoneComponent config={componentConfig}
                                   eventHandlers={eventHandlers}
                                   djsConfig={djsConfig} />
            </div>

        )
    }
}