//React imports
import React, { useState, useEffect, useContext } from 'react';

import { useDropzone } from 'react-dropzone';

import "./DropzoneUploader.scss";

import PropTypes from 'prop-types';

/**
 * Componente para arrastrar y seleccionar archivos
 * @param {*} props 
 */
const DropzoneUploader = props => {
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        accept: props.type
    });
    const [filesToUpload, setFilesToUpload] = useState([]);

    useEffect(() => {
        if (props.upload) {
            props.onFormSubmit(filesToUpload);
            setFilesToUpload([]);
        }
    }, [props.upload]);


    useEffect(() => {
        if (acceptedFiles.length > 0) {
            setFilesToUpload(prevValues => {
                const filesAux = [...prevValues, ...acceptedFiles]
                return filesAux.slice(filesAux.length - props.maxFiles, filesAux.length)
            })
        }
    }, [acceptedFiles])


    const removeFile = (incomingFile) => {
        const filteredFiles = filesToUpload.filter(file => (
            file !== incomingFile
        ));
        setFilesToUpload(filteredFiles);
    }


    const isFileImage = (file) => {
        return file && file['type'].split('/')[0] === 'image';
    }

    const isFileWord = (file) => {
        return file && file['type'].split('/')[1] === 'vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    const isFileExcel = (file) => {
        return file && file['type'].split('/')[1] === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    const isFilePdf = (file) => {
        return file && file['type'].split('/')[1] === 'pdf';
    }

    const urlCreator = window.URL || window.webkitURL;
    let imageURL = null;

    const files = filesToUpload.slice(0, props.maxFiles).map((file, i) => (
        (imageURL = urlCreator.createObjectURL(file)),
        <li key={file.path} className="upload-info-item d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-between align-items-center">
                {isFileImage(file) ?
                    <img className="img-preview align-self-center" src={imageURL} alt="upload image" />
                    : ""
                }
                <p className="align-self-center">{file.path} - {file.size} bytes</p>
            </div>
            <button type="button" onClick={() => removeFile(file)} className="close align-self-center" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </li>
    ));



    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
            <ul>
                {errors.map(e => (
                    <li key={e.code}>{e.message}</li>
                ))}
            </ul>
        </li>
    ));

    return (
        <div>
            <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className="info">
                        <p>Arrastra aqui o </p>
                        <button className="btn btn-success">selecciona</button>
                        <p>una imagen</p>
                    </div>
                </div>
                <section>
                    {filesToUpload.length > 0 ?
                        [<h4 key="image">File(s)</h4>,
                        <ul key="file-list" className="upload-info-container">{files}</ul>]
                        : ""
                    }
                    {fileRejections.length > 0 ?
                        [<h4 key="rejected-files">Rejected files</h4>,
                        <ul key="rejected-files-list">{fileRejectionItems}</ul>]
                        : ""
                    }
                </section>
            </section>
        </div>
    )
};

DropzoneUploader.propTypes = {
    onFormSubmit: PropTypes.func.isRequired,
    upload: PropTypes.bool.isRequired,
    type: PropTypes.string,
    maxFiles: PropTypes.string
}


export default DropzoneUploader;