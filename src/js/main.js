const dataBase = 'https://ecommercebackend.fundamentos-29.repl.co/';


window.addEventListener("DOMContentLoaded", (event) => {
    document.querySelector('.modalLoading').classList.add('modalLoading__unshow');
    main();
});

async function getApi(){
    try {
        const db = await fetch(dataBase);
        const res = await db.json();

        window.localStorage.setItem("products", JSON.stringify(res))

        return res;
    } catch (error) {
        console.log(error)
    }
}

// setTimeout(() => {
//     document.querySelector('.modalLoading').classList.add('modalLoading__unshow')
// }, 5000);

function animationNavBar(){
    const headMainHTMl = document.querySelector('.headMain');
    const totalProductHTML = document.querySelector('.amountProductNav')
    window.addEventListener('scroll', function(){

        headMainHTMl.classList.toggle('headMain__scrollY', window.scrollY > 300)
        totalProductHTML.classList.toggle('amountProductNav__scrollY', window.scrollY > 300) 
    })
}

function amountCartNavbar(store){

    const amountProductNavHTMl = document.querySelector('.amountProductNav');
    let amount= 0;

    for (const product in store.cart) {
        amount+= store.cart[product].amount;
    }

    amountProductNavHTMl.textContent= amount;
}

function addCart(store){
    const accessStore = store.cart

    const productHTML = document.querySelector('.products');

    productHTML.addEventListener('click', function(e){

            if(e.target.classList.contains('bx-plus')){
                const id = Number(e.target.id);
                const findProduct = store.products.find((product) => product.id === id);

                if(accessStore[findProduct.id]){

                    if(findProduct.quantity === accessStore[findProduct.id].amount) 
                        return alert("no hay mas en stock")
                        
                    accessStore[findProduct.id].amount++;
                }else {
                    accessStore[findProduct.id] ={...findProduct, amount: 1}
                }

                window.localStorage.setItem("cart", JSON.stringify(accessStore))

                printProductsInCart(store);
                totalCart(store);
                amountCartNavbar(store);
            }
    })
}

function plusMinusDeleteCart(store){
    const productInCartHTML = document.querySelector('.productsInCart');
    productInCartHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('bx-minus')){
            const id= Number(e.target.parentElement.id);

            if(store.cart[id].amount === 1){
                const response = confirm ('Seguro quieres eliminarlo del carrito?')
                if(!response) return;
                delete store.cart[id];
            }else{
                store.cart[id].amount--;
            }

        }
        if(e.target.classList.contains('bx-plus')){

            const id= Number(e.target.parentElement.id);
            const findProduct = store.products.find((product) => product.id === id)

            if(findProduct.quantity === store.cart[findProduct.id].amount) 
            return alert("no hay mas en stock")

            store.cart[id].amount++;

        }

        if(e.target.classList.contains('bx-trash-alt')){
            const id= Number(e.target.parentElement.id);
            const response = confirm ('Seguro quieres eliminarlo del carrito?')
            if(!response) return;
            delete store.cart[id];
        }

        window.localStorage.setItem('cart', JSON.stringify(store.cart));
        printProductsInCart(store);
        totalCart(store);
        amountCartNavbar(store);
    })
}

function printProductsInCart(store){
    
    let html='';
    for(const product in store.cart){
    const {quantity, name, price, image, id, amount} = store.cart[product]
    html += `
        <div class="productInCart">
            <div class="img__cart">
                <img src="${image}" alt="img"></img>
            </div>
            <div class="info__cart">
                <h4>${name} | $${price}</h4>
                <p>Stock: ${quantity}</p>
                    <div class="options__unit" id="${id}"> 
                        <i class='bx bx-minus'></i>
                        <span>${amount} unit</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bx-trash-alt'></i>
                    </div>
            </div>
                
        </div>
    `
    }
    document.querySelector('.productsInCart').innerHTML = html;
}

function totalCart(store){

    const itemsCart = document.querySelector('.itemsCart');
    const moneyTotal = document.querySelector('.moneyTotal');


    let totalProduct = 0;
    let amountProduct = 0;

    for (const product in store.cart) {
        const{amount,price}=store.cart[product];
        amountProduct += amount;
        totalProduct += amount * price;
    }

    itemsCart.textContent = amountProduct + ' units';
    moneyTotal.textContent = '$' + totalProduct + '.00';

}

function buyCart(store){
    const btn__buyHTML = document.querySelector('.btn__buy');

    btn__buyHTML.addEventListener('click', function(){

        if(!Object.values(store.cart).length) 
            return alert("Pero tienes que tener algo en el carrito, no?");

        const response = confirm("Seguro que quiere comprar?");
        if(!response) return;

        const currentProducts = [];

        for (const product of store.products) {
            const productCart = store.cart[product.id]
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            }else {
                currentProducts.push(product)
            }
        }

        store.products = currentProducts;
        store.cart = {};

        window.localStorage.setItem("products", JSON.stringify(store.products));
        window.localStorage.setItem("cart", JSON.stringify(store.cart));

        totalCart(store);
        printProductsInCart(store);
        prinProducts(store);
        amountCartNavbar(store);
    })
}

function showCartAndDarkMode(){
    const cartHTML=document.querySelector('.productsCart');
    const darkModeCartHTMl = document.querySelector('.darkModeCart');
    const menuQueryHTML = document.querySelector('.menuQuery')

    darkModeCartHTMl.addEventListener('click', function(e){
        if(e.target.classList.contains('bxs-cart')){
            document.querySelector('.cartContent').classList.add('cartContentShow')
        }
        if(e.target.classList.contains('bx-menu-alt-right')){
            document.querySelector('.menuQuery').classList.add('menuQuery__show')
        }
    })
    cartHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('quitCart')){
            document.querySelector('.cartContent').classList.remove('cartContentShow');
        }
    })

    menuQueryHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('quitQuery')){
            document.querySelector('.menuQuery').classList.remove('menuQuery__show')
        }
    })

    
}

function prinProducts(store){
    let html = '';
    for (const product of store.products) {
        html += `
            <div class ="product_${product.category} card__product">
                <div class="product__image">
                    <img src="${product.image}" class="img__product"></img>
                </div>
                <div class="product__info">
                    <div class ="price__stock">
                        <h3 class="priceProduct">
                        <p>$${product.price}.00</p>
                        ${
                            product.quantity ? 
                            `<i  class='bx bx-plus' id="${product.id}"></i>
                            <p class="quantityProduct">Stock: ${product.quantity}</p>` 
                            : "<span class='soldOut'>Sold Out</span>"
                        } 
                        </h3> 
                    </div>
                        <p class="product__description" id="${product.id}"> 
                        ${product.name}
                        </p>
                </div>
            </div>
        `
    };
    document.querySelector('#pr0ductsApi').innerHTML = html;
}

function showModalProduct(){
    const modalProductHTML = document.querySelector('.modalProduct');
    const productsHTML = document.querySelector('.products')

    productsHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('product__description')){
            modalProductHTML.classList.add('modalProduct__show')
        }
    })

    modalProductHTML.addEventListener('click',function(e){
        if(e.target.classList.contains('quitModal')){
            modalProductHTML.classList.remove('modalProduct__show')
        }
    })
}

function modalProduct(store){
    const card__productHTML = document.querySelector('.products')

    card__productHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('product__description')){

            const idCompare = Number(e.target.id);
            const findProduct = store.products.find((product) => product.id === idCompare);

            const{name,image,id,price, quantity, category, description} = findProduct

            let html = `   
                <div class="productInModal">
                    <i class='bx bx-x quitModal'></i>
                    <div class="imgModal">
                        <img src="${image}" alt="${category}"></img>
                    </div>
                    <div class="infoModal">
                        <div class="descriptionModal">
                            <h4>${name}</h4>
                            <p>${description}</p>
                        </div>
                        <div class="priceStockAdd">
                            <div class="priceAdd">
                            <span class="priceModal">$${price}.00</span>                            
                            ${
                                quantity ? 
                                `<i class='bx bx-plus'id="${id}"></i>
                                <span class="stockModal">Stock: ${quantity}</span>` 
                                : "<span class='soldOut'>Sold Out</span>"
                            } 
                            </div>
                        </div>
                    </div>
                </div>
            `
            document.querySelector('.modalProduct').innerHTML = html;
        }
    })

}

function addCartModal(store){
    const modalProductHTML = document.querySelector('.modalProduct');
    const accessStore = store.cart

    modalProductHTML.addEventListener('click',function(e){
        if(e.target.classList.contains('bx-plus')){
            if(e.target.classList.contains('bx-plus')){
                const id = Number(e.target.id);
                const findProduct = store.products.find((product) => product.id === id);

                if(accessStore[findProduct.id]){

                    if(findProduct.quantity === accessStore[findProduct.id].amount) 
                        return alert("no hay mas en stock")
                        
                    accessStore[findProduct.id].amount++;
                }else {
                    accessStore[findProduct.id] ={...findProduct, amount: 1}
                }

                window.localStorage.setItem("cart", JSON.stringify(accessStore))

                printProductsInCart(store);
                totalCart(store);
                amountCartNavbar(store);
            }
        }
    })
}


async function main(){
    const store = {
        products: JSON.parse(window.localStorage.getItem("products")) || await getApi(),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {}
    }
    prinProducts(store);
    showCartAndDarkMode();
    addCart(store);
    printProductsInCart(store);
    plusMinusDeleteCart(store);
    totalCart(store);
    buyCart(store);
    amountCartNavbar(store);
    animationNavBar();
    modalProduct(store);
    showModalProduct();
    addCartModal(store);
}

