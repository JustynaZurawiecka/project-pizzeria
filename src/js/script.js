/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
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
      thisProduct.processOrder();

      console.log('new Product:', thisProduct);
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
    }

    initAccordion() {
      const thisProduct = this;
      const params = thisProduct.data.params;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.accordionTrigger;

      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function (event) {
        console.log('Product clicked');

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

      console.log('initOrderForm was fired');

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
          console.log('change event handler from initOrderForm was fired');
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    } 
    processOrder(){
      const thisProduct = this;

      console.log('processOrder was fired');

      const formData = utils.serializeFormToObject(thisProduct.form);

      let price = thisProduct.data.price;

      /* START loop for each param */
      const params = thisProduct.data.params;

      for(const param in params){
      
        /* START loop for each option */
        const options = params[param].options;
        let isMarked = '';

        for(const option in options){
          /* IF: to check if option is marked, check the following conditions:  */
          /* Check whether formData contains params property */
          /* Check whether params has options */
            if(formData[param].includes(option)){
            /* If both conditions are true the option is marked */
            isMarked = true;
            console.log(isMarked);
          }
          /* ELSE not marked */
          else {
            isMarked = false;
            console.log(isMarked);
            /* END IF */
          }
            /* IMAGES
            / * find all image elements for the option and assing them to the constant */
            const optionImages = thisProduct.imageWrapper;
            console.log('optionImages', optionImages);

            const allImages = optionImages.querySelectorAll('.' + param + '-' + option);
            console.log('allImages' , allImages);

            /* IF option is marked, active class is added for all images for the option (saved in classNames.menuProduct.imageVisible) */
            if(isMarked == true){
              for(const oneImage of allImages){
                oneImage.classList.add(classNames.menuProduct.imageVisible);
                console.log('added active to oneImage', oneImage);
              }
            }
              /* ELSE active class is removed for all images for the option (saved in classNames.menuProduct.imageVisible) */
            else {
              for(const oneImage of allImages){
                oneImage.classList.remove(classNames.menuProduct.imageVisible);
                console.log('removed active to oneImage', oneImage);
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
      thisProduct.priceElem.innerHTML = price;
    }
  }

  const app = {
    initMenu: function () {
      const thisApp = this;

      console.log('thisApp.data: ', thisApp.data);

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
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
