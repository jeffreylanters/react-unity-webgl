export default class UnityLoaderServer {
    constructor () {

    }
    append (src) {
        return new Promise ((resolve, reject) => {
            let unityLoaderScript = document.createElement ('script')
            unityLoaderScript.type = 'text/javascript'
            unityLoaderScript.async = true
            unityLoaderScript.src = src
            unityLoaderScript.onload = () => {
                resolve ()
            }
            document.getElementsByTagName ('head')[0].appendChild (unityLoaderScript)
        })
    }
}