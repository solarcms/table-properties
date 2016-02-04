import React, { Component, PropTypes }  from 'react';
import DropzoneComponent from "react-dropzone-component";
import $ from 'jquery'

import {deleteFile, getExtraImages} from '../../../api/upload'

var myDropzone;
var uploadedFiles = [];

export default class MultiFileUploader extends Component {

    uploadSuccess(e, responsejson){

        uploadedFiles.push({
            size: e.size,
            origName: e.name,
            destinationUrl:responsejson.destinationUrl,
            thumbUrl:responsejson.thumbUrl,
            uniqueName:responsejson.uniqueName
        });

        let uploadedFilesString = JSON.stringify(uploadedFiles);

        if(e.status == 'success')
            this.props.changeHandler(uploadedFilesString);
        else
            alert('error please try again')
    }

    removeImage(e){
        let delIndex = -1;
        if(e.uniqueName){
            deleteFile(e.uniqueName).then((data)=>{
                if(data == 'success'){
                    myDropzone.options.maxFiles = myDropzone.options.maxFiles + 1;

                }
                else
                    alert('Алдаа гарлаа дахин оролдоно уу')
            });
        }

        uploadedFiles.map((uploadedFile, index)=>{

            if(uploadedFile.uniqueName == e.uniqueName){
                    delIndex = index;
            }

        })

        uploadedFiles.splice(delIndex, 1);

        let uploadedFilesString = JSON.stringify(uploadedFiles);

        this.props.changeHandler(uploadedFilesString)

    }
    initCallback(dropzone){


        const { mainValue, disabled, edit_parent_id } = this.props;

        myDropzone = dropzone;



        if(mainValue !== null && mainValue !== '' && mainValue !== undefined){

            let images = JSON.parse(mainValue)


            images.map((ex_image)=>{
                uploadedFiles.push(ex_image)

                let mockFile = { name: ex_image.origName, size: ex_image.size, uniqueName: ex_image.uniqueName };




                myDropzone.emit("addedfile", mockFile);


                myDropzone.emit("thumbnail", mockFile, ex_image.thumbUrl+ex_image.uniqueName);

                // myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);

                myDropzone.emit("complete", mockFile);

                // If you use the maxFiles option, make sure you adjust it to the
                // correct amount:

                let existingFileCount = 1; // The number of files already uploaded
                myDropzone.options.maxFiles = myDropzone.options.maxFiles - existingFileCount;
            })


        }

    }
    render() {
        const { mainValue, fieldClass, placeholder, errorText, disabled, options } = this.props;

        const protcol = window.location.protocol !== 'https:' ? 'http://' :  'https://';
        const baseUrl = protcol+window.location.hostname + window.location.pathname+'/upload-image';


        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,

            postUrl: baseUrl
        };
        let djsConfig = null


        if(this.props.max !== false){
            djsConfig = {
                addRemoveLinks: true,
                uploadMultiple:false,
                maxFiles:this.props.max,
                dictRemoveFile: 'Remove/Устгах',
                params: {
                    test: "test 2"

                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            };
        } else{
            djsConfig = {
                addRemoveLinks: true,
                uploadMultiple:false,
                dictRemoveFile: 'Remove/Устгах',
                params: {
                    test: "test 2"

                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
            };
        }


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

            <div  className={`form-group ${fieldClass}`}>
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
