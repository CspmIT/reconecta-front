// import axios from 'axios'
// import fs from 'fs'
// import qs from 'qs'
// export async function getAccessToken() {
//     let data = qs.stringify({
//         client_id: 'JDwzwfYhY2PbSR2BbStuY5D2Ed3MN3xZUDQWqOhPn5cE5GGW',
//         client_secret: 'z1zMP4KAt9rGQwVKcinXSb3seHdqeuehohdm2mRVvYZvCUsYYjq2AOdpv856mYT7',
//         grant_type: 'client_credentials',
//         scope: 'data:read data:write bucket:read bucket:create'
//     })

//     let config = {
//         method: 'post',
//         url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         data: data
//     }

//     try {
//         const response = await axios(config)
//         return response.data
//     } catch (error) {
//         console.log(error)
//     }
// }
// export async function getBucket(token, bucketKey) {
//     let config = {
//         method: 'get',
//         url: `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/details`,
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         }
//     }

//     try {
//         const response = await axios(config)
//         console.log(response.data)
//     } catch (error) {
//         console.log(error)
//     }
// }
// export async function createBucket(token) {
//     let config = {
//         method: 'post',
//         url: 'https://developer.api.autodesk.com/oss/v2/buckets',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         },
//         data: {
//             bucketKey: 'bucketreco',
//             policyKey: 'transient' // 'transient', 'temporary' or 'persistent', choose based on how long you need the files.
//         }
//     }

//     try {
//         const response = await axios(config)
//         console.log(response.data)
//     } catch (error) {
//         console.log(error)
//     }
// }
// export async function uploadFileAndGetUrn(filePath, bucketKey, objectKey, token) {
//     let fileContent = fs.readFileSync(filePath)
//     let config = {
//         method: 'put',
//         url: `https://developer.api.autodesk.com/oss/v2/buckets/${bucketKey}/objects/${objectKey}`,
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/octet-stream',
//             'Content-Length': fs.statSync(filePath).size
//         },
//         data: fileContent
//     }

//     try {
//         const response = await axios(config)
//         return response.data.objectId
//     } catch (error) {
//         console.log(error)
//     }
// }

// export async function main() {
//     const token = await getAccessToken()
//     const urn = await uploadFileAndGetUrn(
//         './file/GEOREFERNCIADO - AGUA (01-07-20) (1).dwg',
//         'bucketreco',
//         'GEOREFERNCIADO - AGUA (01-07-20) (1).dwg',
//         token
//     )
//     console.log('URN:', urn)
// }

// var viewer
// export function initializeViewer(containerId, documentId, token) {
//     var options = {
//         env: 'AutodeskProduction',
//         getAccessToken: function (onTokenReady) {
//             var token = token
//             var timeInSeconds = 3600 // Use value provided by Forge Authentication (OAuth) API
//             onTokenReady(token, timeInSeconds)
//         }
//     }

//     Autodesk.Viewing.Initializer(options, function () {
//         viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById(containerId))
//         viewer.start()
//         Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure)
//     })

//     function onDocumentLoadSuccess(doc) {
//         var viewables = doc.getRoot().getDefaultGeometry()
//         viewer.loadDocumentNode(doc, viewables).then((i) => {
//             // documented loaded, any action?
//         })
//     }

//     function onDocumentLoadFailure(viewerErrorCode) {
//         console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
//     }
// }
