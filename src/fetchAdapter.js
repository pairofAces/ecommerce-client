class FetchAdapter {
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }

    // define the method 'get' that's used in app.js file
    get(relativeUrl, callback){
        

        fetch(`${this.baseUrl}${relativeUrl}`)
        .then(resp => resp.json())
        .then(callback)
    }
}