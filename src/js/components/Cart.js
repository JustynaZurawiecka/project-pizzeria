import {settings, select, classNames, templates} from '../settings.js';
import CartProduct from './CartProduct.js';
import {utils} from '../utils.js';

class Cart{
  constructor(element){
    const thisCart = this;

    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger); 
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);   
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    console.log(thisCart.dom, 'Cart DOM');

    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions(){
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      if(thisCart.dom.wrapper.classList.contains(classNames.cart.wrapperActive)){
        thisCart.dom.wrapper.classList.remove(classNames.cart.wrapperActive);
      }
      else {
        thisCart.dom.wrapper.classList.add(classNames.cart.wrapperActive);
      }
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(event){
      event.preventDefault();
      thisCart.remove(event.detail.cartProduct);
      console.log('product removed');
    });

    thisCart.dom.form.addEventListener('submit', function () {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /* create DOM element */
    const generateDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to cart */
    thisCart.dom.productList.appendChild(generateDOM);

    console.log('adding product to cart');

    thisCart.products.push(new CartProduct(menuProduct, generateDOM));

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let cartProduct of thisCart.products) {
      thisCart.subtotalPrice += cartProduct.price * cartProduct.amount;
      thisCart.totalNumber += cartProduct.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    console.log('totalNumber', thisCart.totalNumber);
    console.log('subtotalPrice', thisCart.subtotalPrice);
    console.log('thisCart.totalPrice', thisCart.totalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(index, 1);

    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      totalPrice: thisCart.totalPrice,
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let product of thisCart.products){
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        console.log(response);
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });
  }
}

export default Cart;