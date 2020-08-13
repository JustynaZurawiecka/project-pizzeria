import {templates, select, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './AmountWidget.js';

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

    thisProduct.params = {};

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
          if(!thisProduct.params[param]){
            thisProduct.params[param] = {
              label: params[param].label, 
              options: {},
            };
          }
          thisProduct.params[param].options[option] = options[option].label;
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

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);

  }

}

export default Product;