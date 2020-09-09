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
let buttonsDOM = [];


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
                    alt="" 
                    class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
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
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;

        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart){
                button.innerText = "In Cart";
                button.disable = true;
            } 
            
            button.addEventListener('click', e => {
                e.target.innerText = "In Cart";
                e.target.disabled = true;

                //get the product from the local storage by ID
                let cartItem = {...Storage.getProduct(id), amount:1};
                
                // add the product to the cart
                cart = [...cart, cartItem]
                
                // save the cart into the local storage 
                Storage.saveCart(cart) 

                //set cart values
                this.setCartValues(cart)

                // display the cart item within the cart
                this.addCartItem(cartItem)

                //show the cart when user adds an item into the cart
                this.showCart();
            })
            
        })
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
            <div>
                <h4>${item.name}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>Remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
        `
        cartContent.appendChild(div)
        
    }
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
}

//local storage class
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id.toString() === id.toString())
        
    }

    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}

document.addEventListener('DOMContentLoaded', e => {
    const ui = new UI();
    const products = new Products();

    //use the class method to get the products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)}
    ).then(()=> {
        ui.getBagButtons();
    });

})