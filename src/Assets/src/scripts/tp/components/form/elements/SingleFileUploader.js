import React, { Component, PropTypes }  from 'react';
import DropzoneComponent from "react-dropzone-component";
import getMeta from '../../../lib/getMeta'

import {deleteFile} from '../../../api/upload'


export default class SingleFileUploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myDropzone: null,
        };
    }

    uploadSuccess(e, responsejson){

        if(e.status == 'success')
            this.props.changeHandler('{"size":'+e.size+',"origName":"'+e.name+'","destinationUrl": "'+responsejson.destinationUrl+'", "thumbUrl":"'+responsejson.thumbUrl+'", "uniqueName":"'+responsejson.uniqueName+'"}');
        else
            alert('error please try again')
    }

    removeImage(e){

        if(e.uniqueName)
        deleteFile(e.uniqueName).then((data)=>{
            if(data == 'success'){
                

                let myDropzone = this.state.myDropzone;
                myDropzone.options.maxFiles = myDropzone.options.maxFiles + 1;
                this.props.changeHandler(null)

                this.setState({myDropzone: myDropzone});


            }
            else
                alert('Алдаа гарлаа дахин оролдоно уу')
        });

    }
    initCallback(dropzone){

        const { mainValue, disabled } = this.props;



        if(mainValue !== null && mainValue !== ''){

            let image = JSON.parse(mainValue)


            let mockFile = { name: image.origName, size: image.size, uniqueName: image.uniqueName };



            let myDropzone = dropzone;


            myDropzone.emit("addedfile", mockFile);


            myDropzone.emit("thumbnail", mockFile, image.thumbUrl+image.uniqueName);

            // myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);

            myDropzone.emit("complete", mockFile);

            // If you use the maxFiles option, make sure you adjust it to the
            // correct amount:

            let existingFileCount = 1; // The number of files already uploaded
            myDropzone.options.maxFiles = myDropzone.options.maxFiles - existingFileCount;


            this.setState({myDropzone: myDropzone});




        }

    }
    render() {
        const { mainValue, fieldClass, placeholder, errorText, disabled, dataIndex, fieldClassName } = this.props;

        const protcol = window.location.protocol !== 'https:' ? 'http://' :  'https://';
        const baseUrl = protcol+window.location.hostname + window.location.pathname+'/upload-file';


        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.pdf', '.swf', '.ppt', '.pptx'],
            showFiletypeIcon: false,

            postUrl: baseUrl
        };
        const djsConfig = {
            addRemoveLinks: true,
            uploadMultiple:false,
            maxFiles:1,
            dictRemoveFile: 'Remove/Устгах',
            params: {
                test: "test 2"

            },
            headers: {'X-CSRF-TOKEN':  getMeta('csrf-token')}
        };

        const eventHandlers = {
            // This one receives the dropzone object as the first parameter
            // and can be used to additional work with the dropzone.js
            // object
            init: this.initCallback.bind(this),

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

            <div  className={`form-group ${fieldClass} ${fieldClassName}`}  id={`solar-form-group-${dataIndex}`}>
                <label className="control-label">{placeholder}</label>
                <div>
                    {disabled == true ? null :
                    <DropzoneComponent config={componentConfig}
                                       eventHandlers={eventHandlers}
                                       djsConfig={djsConfig} /> }
                </div>
                <span className="help-block">
                    {errorText}
                </span>
            </div>
        )
    }
}
