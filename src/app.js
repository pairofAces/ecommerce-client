document.addEventListener("DOMContentLoaded", e => {
    
    //runtime stuff will go here
    baseUrl = "http://localhost:3000/"
    //we will have a 'const' variable relating to the 'fetchAdapter' and assign it to a 
    // new instance of the fetchAdapter class, taking in the paramter of our base url
    // example:

    const ecommerceFetchAdapter = new FetchAdapter(baseUrl)

    //this is an example of a callback
    let action = users => users.forEach(console.log)

    //I want to fetch all users and log their names
   ecommerceFetchAdapter.get("users", action)

})