/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      // console.log('new Product:', thisProduct);
    }

    renderInMenu() {
      const thisProduct = this;

      /* generate HTML based on template */
      const generatedHTML = templates.menuProduct(thisProduct.data);

      /* create element using utilis.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion() {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.accordionTrigger;

      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function (event) {
        // console.log('Product clicked');

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.add(classNames.menuProduct.wrapperActive);

        /* find all active products */
        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);

        /* START LOOP: for each active product */
        for (const activeProduct of allActiveProducts) {

          /* START: if the active product isn't the element of thisProduct */
          if (thisProduct.element !== activeProduct) {
            /* remove class active for the active product */
            activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }
        /* END: click event listener to trigger */
      });
    }
    initOrderForm(){
      const thisProduct = this;

      // console.log('initOrderForm was fired');

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
          // console.log('change event handler from initOrderForm was fired');
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    } 
    processOrder(){
      const thisProduct = this;

      // console.log('processOrder was fired');

      const formData = utils.serializeFormToObject(thisProduct.form);

      console.log('thisProduct.params88888888888888',thisProduct.params);

      thisProduct.params = {};

      let price = thisProduct.data.price;

      /* START loop for each param */
      const params = thisProduct.data.params;
      console.log('param zaraz PO PRZYPISANIUUUUUUUUUUUUUUUU', params);
      for(const param in params){
        console.log('param w PETELCEEEEEEEEEEEEEEEEEE', param);
        console.log('params[param] w PETELCEEEEEEEEEEEEEEEEEE', params[param]);
        console.log('param.label 1111111111111', param.label);
        console.log('thisProduct.data.params.param.label 1111111111111', thisProduct.data.params.param);
        /* START loop for each option */
        const options = params[param].options;
        console.log('params[param].options  3333333333',params[param].options);
        let isMarked = '';

        for(const option in options){

          /* IF: to check if option is marked, check the following conditions:  */
          /* Check whether formData contains params property */
          /* Check whether params has options */
          if(formData[param].includes(option)){
            /* If both conditions are true the option is marked */
            isMarked = true;
          }
          /* ELSE not marked */
          else {
            isMarked = false;
          /* END IF */
          }
          /* IMAGES
          / * find all image elements for the option and assing them to the constant */
          const optionImages = thisProduct.imageWrapper;

          const allImages = optionImages.querySelectorAll('.' + param + '-' + option);

          /* IF option is marked, active class is added for all images for the option (saved in classNames.menuProduct.imageVisible) */
          if(isMarked){
            console.log('thisProduct na poczatku IS MARKEDDDDD',thisProduct);
            console.log('param ten z petliiiiiiiii', param);
            console.log('param.label ten z petliiiiiiiii', param.label);
            console.log('option ten z petliiiiiiiii', option);
            // console.log('thisProduct.params[param] IS MARKED',thisProduct.params[param]);
            if(!thisProduct.params[param]){
              thisProduct.params[param] = {
                label: params[param].label, 
                options: {},
              };
            }
            console.log('thisProduct.params[param] IS MARKED',thisProduct.params[param]);
            console.log('param.label 22222222222', param.label);
            thisProduct.params[param].options[option] = options[option].label;
            console.log('thisProduct.params[param].options[option]',thisProduct.params[param].options[option]);
            console.log('option.label',option.label);
            for(const oneImage of allImages){
              oneImage.classList.add(classNames.menuProduct.imageVisible);
            }
          }
          /* ELSE active class is removed for all images for the option (saved in classNames.menuProduct.imageVisible) */
          else {
            for(const oneImage of allImages){
              oneImage.classList.remove(classNames.menuProduct.imageVisible);
            }
          }
          

          /* Check if option is default */   
          if(isMarked == true && options[option].default !== true){

            /* IF option is marked and not default increase the price */
            price += options[option].price;
          } else if(isMarked == false && options[option].default == true){
            /* IF option is not marked and default decrease the price */
            price -= options[option].price;
          }
        /* END loop for each option */
        }
      /* END loop for each param */
      }
      /* multiply price by amount */
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      thisProduct.priceElem.innerHTML = thisProduct.price;
    }
    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }
    addToCart(){
      const thisProduct = this;

      thisProduct.name = thisProduct.data.name;
      thisProduct.amount = thisProduct.amountWidget.value;
      console.log('thisProduct 7777777777777777',thisProduct);
      app.cart.add(thisProduct);
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      // console.log('AmountWidget' , thisWidget);
      // console.log('constructor arguments', element);
    }

    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value){
      const thisWidget = this; 

      const newValue = parseInt(value);
      /* Add validation */

      if(newValue !== thisWidget.value 
        && newValue >= settings.amountWidget.defaultMin 
        && newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      }
      thisWidget.input.value = thisWidget.value;
    }
    initActions(){
      const thisWidget = this; 

      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });
      
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
      
    }
    announce() {
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();

      console.log('new Cart', thisCart);
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;

      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger); 
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);   
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
    }
    add(addProduct){
      const thisCart = this;

      /* generate HTML based on template */
      const generatedHTML = templates.cartProduct(addProduct);
      console.log('generatedHTML',generatedHTML);

      /* create DOM element */
      const generateDOM = utils.createDOMFromHTML(generatedHTML);
      console.log('generateDOM',generateDOM);

      /* add element to cart */
      thisCart.dom.productList.appendChild(generateDOM);
      console.log('thisCart.dom.productList',thisCart.dom.productList);

      console.log('adding product to cart');
    }
  }

  const app = {
    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
    initMenu: function () {
      const thisApp = this;

      // console.log('thisApp.data: ', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function () {
      const thisApp = this;
      // console.log('*** App starting ***');
      // console.log('thisApp:', thisApp);
      // console.log('classNames:', classNames);
      // console.log('settings:', settings);
      // console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };

  app.init();
}
