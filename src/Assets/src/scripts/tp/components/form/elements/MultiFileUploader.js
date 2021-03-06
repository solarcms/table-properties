import React, { Component, PropTypes }  from 'react';
import DropzoneComponent from "react-dropzone-component";
import getMeta from '../../../tools/getMeta'

import {deleteFile, getExtraImages} from '../../../api/upload'
//
// var myDropzone;
// var uploadedFiles = [];

export default class MultiFileUploader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            myDropzone: null,
            uploadedFiles : []
        };
    }

    componentWillUnmount(){

        this.setState({uploadedFiles: []});

    }

    componentWillMount(){

    }


    uploadSuccess(e, responsejson){
        let uploadedFiles = this.state.uploadedFiles;
        if(e.status == 'success'){
            if (responsejson instanceof Array) {

                responsejson.map((response)=>{
                    let duplicated = false;
                    uploadedFiles.map((uploadedFile)=>{
                        if(uploadedFile.uniqueName == response.uniqueName)
                            duplicated = true
                    })
                    if(duplicated === false)
                        uploadedFiles.push({
                            size: e.size,
                            origName: e.name,
                            destinationUrl:response.destinationUrl,
                            thumbUrl:response.thumbUrl,
                            uniqueName:response.uniqueName
                        });
                })
            } else {
                let duplicated = false;
                uploadedFiles.map((uploadedFile)=>{
                    if(uploadedFile.uniqueName == responsejson.uniqueName)
                        duplicated = true
                })
                if(duplicated === false)
                    uploadedFiles.push({
                        size: e.size,
                        origName: e.name,
                        destinationUrl:responsejson.destinationUrl,
                        thumbUrl:responsejson.thumbUrl,
                        uniqueName:responsejson.uniqueName
                    });

            }

            let uploadedFilesString = JSON.stringify(uploadedFiles);
            this.props.changeHandler(uploadedFilesString);
        }

        else
            alert('error please try again')

        this.setState({uploadedFiles: uploadedFiles});
    }
    removeImage(e){
        let uploadedFiles = this.state.uploadedFiles;
        let myDropzone = this.state.myDropzone;
        let delIndex = -1;
        if(e.uniqueName){
            deleteFile(e.uniqueName).then((data)=>{
                if(data == 'success'){
                    if(this.props.max !== false) {
                        myDropzone.options.maxFiles = myDropzone.options.maxFiles + 1;
                    }

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

        this.setState({uploadedFiles: uploadedFiles});
        this.setState({myDropzone: myDropzone});

    }
    initCallback(dropzone){


        const { mainValue, disabled, edit_parent_id } = this.props;

        let myDropzone = dropzone;
        let uploadedFiles = this.state.uploadedFiles;



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
                if(this.props.max !== false) {
                    let existingFileCount = 1; // The number of files already uploaded
                    myDropzone.options.maxFiles = myDropzone.options.maxFiles - existingFileCount;
                }
            })


        }

        this.setState({myDropzone: myDropzone});

        this.setState({uploadedFiles: uploadedFiles});

    }
    render() {
        const { mainValue, fieldClass, placeholder, errorText, disabled, options, dataIndex, fieldClassName} = this.props;

        const protcol = window.location.protocol !== 'https:' ? 'http://' :  'https://';
        const baseUrl = protcol+window.location.hostname + window.location.pathname+'/upload-file';


        const componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: false,

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
                },
                headers: {'X-CSRF-TOKEN': getMeta('csrf-token')}
            };
        } else{

            djsConfig = {
                addRemoveLinks: true,
                uploadMultiple:true,
                dictRemoveFile: 'Remove/Устгах',
                params: {
                },
                headers: {'X-CSRF-TOKEN': getMeta('csrf-token')}
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
