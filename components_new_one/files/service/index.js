'use strict'
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')
const filepreview = require('filepreview')


const uploadFile = async (params) => {
    const log = logger.start(`files:services:uploadImagetoTemp`)

    params.ext = await checkExtension(params)

    params.path = '/tmp/';
    await createTempFolder(params.path)

    const obj = {
        userId: params.payload.userId,
        tmpLocation: params.path,
        fileOriginalName: params.payload.file.hapi.filename,
        fileType: params.payload.file.hapi.headers["content-type"],
        fileExtension: params.ext,
        type: params.payload.type,
        uploadedAt: moment().unix()
    }

    params.fileDetails = await db.files(obj).save()
    const flg = await writeFile(params)

    // if (params.payload.type == 2 || params.payload.type == 4 || params.payload.type == 5)
    //     params.fileDetails = await generateThumbnail(params)

    log.end()
    console.log('params.fileDetails',params.fileDetails)
    return params.fileDetails
}

const checkExtension = async (params) => {
    logger.start("files:checkExtension")
    const ext = params.payload.file.hapi.filename.substr(params.payload.file.hapi.filename.lastIndexOf('.') + 1);

    logger.start(`file extension found ${ext}`)

    if (params.payload.type == 1) {
        console.log('params.payload.type',params.payload.type)
        if (ext != 'jpg' && ext != 'jpeg' && ext != 'png') throw new Error("Only images with format jpg , jpeg , png allowed")
    } else if
     (params.payload.type == 2 || params.payload.type == 4 || params.payload.type == 5) {
        console.log('params.payload.type == 2',params.payload.type)
        if (ext != 'mp4' && ext != 'mpeg') throw new Error("Only video with format mp4 and mpeg are allowed")
    } else if (params.payload.type == 3 || params.payload.type == 6) {
        console.log('params.payload.type == 3',params.payload.type)
        if (ext != 'jpg' && ext != 'jpeg' && ext != 'png' && ext != 'pdf' && ext != 'txt' && ext != 'docx' && ext != 'doc' && ext != "mp4") throw new Error("Only file with format pdf, txt , docx and doc are allowed")
    }
    await checkSize(params)

    return ext;
}

const checkSize = async (params) => {
    logger.start("Uploadfile:checkSize")
    logger.start("uploadFile::currently allowing 300 mb")
    if (params.payload.file['_data'].length > 1048576 * 300) throw new Error("Maximum file size allowed 300 MB")

    return true;
}

const createTempFolder = async (params) => {

    const mode = "0777";
    try {
        logger.start("uploading image in temp folder")
        const x = await fs.mkdirSync(params, mode)
        return true;
    } catch (err) {
        if (err.code != 'EEXIST') {
            logger.error(err)
        }
        return true;
    }
}

const writeFile = async (params) => {

    const writePath = params.path + '/' + params.fileDetails._id + '.' + params.ext;
    const fileStream = fs.createWriteStream(writePath);
    await params.payload.file.pipe(fileStream)
    fileStream.on('finish', function() {
        return true;
    });


}

const moveFileFromTempToCdn = async (params) => {
    logger.start("files:services:creating folder on server")
    const fileInfo = await db.files.findOne({ _id: params.imageId, tmpFile: true }) 
    if(fileInfo){
        
        const oldPath = fileInfo.tmpLocation + "/" + fileInfo._id + "." + fileInfo.fileExtension;
        const newPath = path.join(__dirname, "../../../assets/images/cdn/" + fileInfo.userId + "/" + fileInfo._id + "." + fileInfo.fileExtension);
        const folderPath = path.join(__dirname, "../../../assets/images/cdn/" + fileInfo.userId);
    
        await createTempFolder(folderPath)
        const record = await moveFileToServer(fileInfo, oldPath, newPath)
        return record;
    }
    else{
        return false;
    }
}

const moveFileToServer = async (fileInfo, oldPath, newPath) => {
    logger.start("files:services:moving file on server from temp")
    try {
        fs.renameSync(oldPath, newPath)
        const record = await updateFileRecord(fileInfo)
        return record;
    } catch (err) {
        if (err.code == 'EXDEV') {
            var execStatement = 'mv ' + oldPath + '  ' + newPath;
            await exec(execStatement)
            const record = await updateFileRecord(fileInfo)
            return record;
        }
    }

}

const updateFileRecord = async (fileInfo) => {
    logger.start("files:services:updating file in db")
    const record = await db.files.findOneAndUpdate({ _id: fileInfo._id }, { tmpFile: false }, { new: true })
    return record;
}

const fetchFile = async (params) => {
    console.log('params',params)
    if(params.fileId !== undefined && params.fileId !== '' && params.fileId !== null){
        console.log('inside the if')
        const file = await db.files.findOne({ _id: params.fileId, isDeleted: false, tmpFile: false })
        console.log('dile',file)
        if(file == null || file == undefined || file == '')
        {
            console.log('file not found')
            return false
        }
        return file;
    }else{
        console.log('inside the else')
        return false
    }
}
const deleteFile = async (params) => {
    logger.start("files:services:deleteFile")
    let objToSave = {}

    const fileUpdate = await db.files.findOneAndUpdate({ _id: params.fileId, type: params.type, userId: params.userId }, { isDeleted: true }, { new: true })
    if (fileUpdate == null) {
        throw new Error("Either type is invalid or you are not authorised")
    }
    // change it for deleting  file
    params.type == 2 ? objToSave.$pull = { correspondence: params.fileId } : null
    params.type == 3 ? objToSave.$pull = { "family.$.relationProofId": params.fileId } : null
    params.type == 4 ? objToSave.$pull = { "family.$.correspondenceId": params.fileId } : null
    params.type == 5 ? objToSave.$unset = { identityProof: params.fileId } : null
    params.type == 6 ? objToSave.$unset = { signature: params.fileId } : null
    params.type == 7 ? objToSave.$pull = { documents: params.fileId } : null

    const user = await db.users.findOneAndUpdate({ _id: params.userId }, objToSave)
    return "File deleted successfully"
}

const generateThumbnail = async (params) => {
    const options = { width: 400, height: 300, quality: 90 };

    if (!filepreview.generateSync(params.path + '/' + params.fileDetails._id + '.' + params.ext, params.path + '/' + params.fileDetails._id + '.' + 'png', options)) {
        throw new Error("Error in uplaoding video.")
    } else {
        const thumb = params.path + '/' + params.fileDetails._id + '.' + 'png';
        const data = fs.readFileSync(thumb);
        await db.files.findOneAndUpdate({ _id: params.fileDetails._id }, { thumbnail: data }, { new: true })

        return params

    }


}


exports.uploadFile = uploadFile
exports.checkExtension = checkExtension
exports.checkSize = checkSize
exports.createTempFolder = createTempFolder
exports.writeFile = writeFile
exports.moveFileFromTempToCdn = moveFileFromTempToCdn
exports.moveFileToServer = moveFileToServer
exports.updateFileRecord = updateFileRecord
exports.fetchFile = fetchFile
exports.deleteFile = deleteFile
exports.generateThumbnail = generateThumbnail