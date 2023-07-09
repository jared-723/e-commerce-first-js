const dataBase = 'https://ecommercebackend.fundamentos-29.repl.co/';

async function getApi(){
    try {
        const db = await fetch(dataBase);
        const res = db.json();
        return res;
    } catch (error) {
        console.log(error)
    }
}

function addCart(store){
    const accessStore = store.cart
    const cartContetHTML = document.querySelector('.productsInCart');
    const productHTML = document.querySelector('.card__product');

    productHTML.addEventListener('click', function(e){
        let html = '';
            if(e.target.classList.contains('bx-plus-circle')){
                store.products.forEach(({name, quantity, price, id, image}) => {
                    if(e.target.id == id){
                        html += `
                        <div class="productInCart"> 
                            <div class="imgProductCart">
                                <img src="${image}" class="imgPCart"></img>
                            </div>
                            <div class="infoProductCart">
                                <h3>${name}</h3>
                                <div class="stockPriceCart">
                                <p>Stock: ${quantity}</p>
                                <p>$${price}</p>
                                </div>
                                <div class="subTotalCart"></div>
                                <div class="addReduceProductCart"></div>
                            </div>
                        </div>
                    `
                    return html;
                    }
                });
            cartContetHTML.innerHTML = html;
            }
    })
}

function showCartAndDarkMode(){
    const cartHTML=document.querySelector('.cartContent');
    const darkModeCartHTMl = document.querySelector('.darkModeCart');

    darkModeCartHTMl.addEventListener('click', function(e){
        if(e.target.classList.contains('bxs-cart')){
            cartHTML.classList.add('cartContentShow')
        }
    })
    cartHTML.addEventListener('click', function(e){
        if(e.target.classList.contains('quitCart')){
            cartHTML.classList.remove('cartContentShow');
        }
    })
}

function prinProducts(e){
    let html = '';
    
    e.products.forEach(({id, name, price, image, category, quantity}) => {
        html += `
            <div class ="product ${category} card__product">
                <div class="product__image">
                    <img src="${image}" class="img__product"></img>
                </div>
                <div class="product__info">
                    <div class ="price__stock">
                        <i class='bx bx-plus-circle' id="${id}"></i>
                        <h3 class="priceProduct">$ ${price}.00 </h3> 
                        <p class="quantityProduct">Stock: ${quantity}</p>
                    </div>
                        <p class="product__description" id="${id}"> 
                        ${name}
                        </p>
                </div>
            </div>
        `

    });
    document.querySelector('#pr0ductsApi').innerHTML = html;
}


async function main(){
    const store = {
        products: await getApi(),
        cart: {}
    }
    prinProducts(store);
    showCartAndDarkMode();
    addCart(store);
}


main();