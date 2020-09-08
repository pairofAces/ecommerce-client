// document.addEventListener("DOMContentLoaded", e => {
//   ------------------------------------------------------  
    //comment this section out if necessary... coded along Ian's project setup tutorial

//     //runtime stuff will go here
//     baseUrl = "http://localhost:3000/"

//     //we will have a 'const' variable relating to the 'fetchAdapter' and assign it to a 
//     // new instance of the fetchAdapter class, taking in the paramter of our base url
//     // example:

//     const ecommerceFetchAdapter = new FetchAdapter(baseUrl)

//     //this is an example of a callback
//     let action = users => users.forEach(console.log)

//     //I want to fetch all users and log their names
//    ecommerceFetchAdapter.get("users", action)
// })
//   ------------------------------------------------------

baseUrl = "http://localhost:3000/"
const ecommerceFetchAdapter = new FetchAdapter(baseUrl)
let action = products => products.forEach(console.log)
// ecommerceFetchAdapter.get("products", action)

//create global variables for the classes on the ecommerce webpage
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productDOM = document.querySelector('.products-center');

//create variable to represent the cart
let cart = [];  //empty array that will contain the items the user will add

//create the class to get the products (from rails backend)
class Products {
    async getProducts() {
        try {
            let result = await fetch("http://localhost:3000/products/");
            let data = await result.json();
            // return data;
            let products = data;
            products = products.map(item => {
                const name = item.name;
                const price = item.price;
                const id = item.id;
                const image = item.image;
                const description = item.description;
                return {name, price, id, image, description}
            })
            return products
        } catch (error) {
            console.log(error);
        }
    }
}

//create another function to display the products
class UI {
    displayProducts(products){
        let result = '';
        products.forEach(product => {
            result += `
                <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} 
                    alt="iphone" 
                    class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
                <h3>${product.name}</h3>
                <h4>Price:$${product.price}</h4>
            </article>
            <!-- End of single product -->
            `
        });
        productDOM.innerHTML = result;
    }
}

//local storage class
class Storage {

}

document.addEventListener('DOMContentLoaded', e => {
    const ui = new UI();
    const products = new Products();

    //use the class method to get the products
    products.getProducts().then(products => ui.displayProducts(products));
})