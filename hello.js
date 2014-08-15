
start_spooky = function (order, callback){
    try {
        var Spooky = require('spooky');
    } catch (e) {
        var Spooky = require('../lib/spooky');
    }

    // create function taking params and callback
    // at the end, call callback(results)


    var spooky = new Spooky({
            child: {
                transport: 'http'
            },
            casper: {
                logLevel: 'debug',
                verbose: true ,
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
                viewportSize: {width: 1024, height: 768}
            }
        }, function (err) {
            if (err) {
                e = new Error('Failed to initialize SpookyJS');
                e.details = err;
                throw e;
            }

            spooky.start('http://en.wikipedia.org/wiki/Shah_rukh_khan');
            
            var CHECKOUT_URL = 'https://www.ssense.com/checkout?isAjax=true';
              
            var email = order["retailer_credentials"]["email"];
            var products = order["products"];
            var password = order["retailer_credentials"]["password"];
            var shipping_firstname = order["shipping_address"]["first_name"];
            var shipping_lastname = order["shipping_address"]["last_name"];
            var shipping_address = order["shipping_address"]["address"];
            var shipping_country = order["shipping_address"]["country"];
            var shipping_state = order["shipping_address"]["state"];
            var shipping_postalcode = order["shipping_address"]["zip_code"];
            var shipping_city = order["shipping_address"]["city"];
            var shipping_phone = order["shipping_address"]["phone"];
            var max_price = order["max_price"];

            for(i=0; i<products.length;i++)
            {
                product = products[i];
                var quantity = product["quantity"];
                if (typeof product["size"] !== 'undefined')
                {
                    var size = product["size"];
                }
                else
                {
                    var size = 0;
                } 

                if(size != 0)
                {
                    size = size + "_";
                }  
                var product_id = product["product_id"];
                var category = product["category"];
                for(j=0;j<quantity;j++)
                {
                    add_single_product_cart(size, category, product_id);
                }
            }

            function add_single_product_cart( size, category, product_id )
            {
                spooky.thenOpen('http://ssense.com/'+category+'/product/rs/rs/'+product_id);



                spooky.then(function(){
                    this.capture('captures/[Add to Cart] Before adding products.png');
                });


                spooky.then(function(){
                    this.waitForSelector('.btnAddToBag');      
                });

                if(size != 0)
                {
                    spooky.then([{
                          size: size
                        }, function(){
                        var new_size = this.evaluate(function(size){
                            var size_on_page = $('option[value*='+ size +']').val();
                            console.log('SIZE ON PAGE: ' + size_on_page)
                            return size_on_page;
                        }, { size: size});

                        if(new_size === null)
                        {
                            this.emit('error', 'invalid_size');
                        }
                        
                        // this.emit('hello', "New Size: " +new_size); 
                        // console.log('hello', "New Size: " +new_size);

                        this.evaluate(function(new_size){   
                          jQuery('select[id="size"]').val(new_size);     
                        }, { new_size: new_size});     
                    }]);
                }


                spooky.then(function(){
                    this.evaluate(function() {      
                        $('.btnAddToBag').click();  
                    });
                });

                spooky.then(function(){
                    this.wait(2000);
                });

                spooky.then(function(){
                    this.waitForSelector('.productAdded');
                    this.waitForSelector(".btn-checkout");
                }); 

                spooky.then(function(){
                    this.capture('captures/[Add to Cart] After adding products.png');
                });
            }

            spooky.then(function(){
                this.waitForSelector(".btn-checkout")
            });

            spooky.then(function(){
                this.emit('hello', 'Clicking the checkout button on the products display page.');
                this.evaluate(function() {
                    $('.btn-checkout').click()
                });
            });

            spooky.then(function(){
                this.wait(1000);
            });

            spooky.then(function(){
                this.capture('captures/[Add to Cart] Final product page.png');
            });

            spooky.then(function(){
                this.waitForSelector('.checkout-button');
            });

            spooky.then(function(){
                this.evaluate(function(){
                    $('.login').click();
                });          
            });

            spooky.then(function(){
                this.wait(2000);
            });

            spooky.then(function(){
                this.capture('captures/[Login] Before login.png');
            });

            spooky.then(function(){
                this.waitForSelector('.btnLogin');
            });

            spooky.then(function(){
                this.waitForSelector('input[type = email]');
            });

            spooky.thenEvaluate(function(email, password){   
                    $('input[type = email]')[0].value = email;
                    $('input[type = password]')[0].value = password;
            }, {    email: email,
                    password: password });


            spooky.then(function(){
                this.evaluate(function(){
                    $('.btnLogin').click();
                }); 
            });

            spooky.then(function(){
                this.wait(1000);
            });

            spooky.then(function(){
                this.capture('captures/[Login] After login .png');
            });

            spooky.thenOpen(CHECKOUT_URL);

            spooky.then(function(){
                this.wait(1000);
            });

            spooky.then(function(){
              this.waitForSelector('#confirm');
            });

            spooky.then(function(){
                this.capture('captures/[Checkout] Before filling the details.png');
            });

            spooky.then(function(){
                this.waitForSelector('input[name="shipping_lastname"]');
                this.waitForSelector('input[name="shipping_firstname"]');
                this.waitForSelector('input[name="shipping_address"]');
            });

            spooky.thenEvaluate(function( shipping_firstname, shipping_lastname, shipping_address){
                console.log("Checkout page loaded");
                console.log("Entering shipping last name.");
                $('input[name="shipping_lastname"]').val(shipping_lastname);
                console.log("Entering shipping first name.");
                $('input[name="shipping_firstname"]').val(shipping_firstname);
                console.log("Entering shipping address.");
                $('input[name="shipping_address"]').val(shipping_address);
            }, { shipping_firstname: shipping_firstname,
               shipping_lastname: shipping_lastname,
               shipping_address: shipping_address });

            spooky.then(function(){
                this.waitForSelector('select[name="shipping_country"]');
                this.waitForSelector('input[name="shipping_postalcode"]');
            });

            spooky.thenEvaluate(function( shipping_country, shipping_state, shipping_postalcode){
         
                console.log("Entering shipping country");
                $('select[name="shipping_country"]').val(shipping_country);
                $('select[name="shipping_country"]').trigger('change');
                $('select[name="shipping_state"]').val(shipping_state);
                $('select[name="shipping_state"]').trigger('change');
                
                console.log("Entering shipping zip-code");
                $('input[name="shipping_postalcode"]').val(shipping_postalcode);

            }, { shipping_country: shipping_country, shipping_state: shipping_state, shipping_postalcode: shipping_postalcode });

            spooky.thenEvaluate(function( shipping_city, shipping_phone){
         
                console.log("Entering shipping city");
                $('input[name="shipping_city"]').val(shipping_city);
                console.log("Entering phone number");
                $('input[name="shipping_phone"]').val(shipping_phone);
                $('select[name="shipping_state"]').trigger('change');
                $('select[name="shipping_method"]').trigger('change');

            }, { shipping_city: shipping_city, shipping_phone: shipping_phone }); 

            spooky.then(function(){
               this.wait(1000);
            });

            spooky.thenEvaluate(function(){
                  // Inserting credit card information.
                console.log($('select[name="shipping_method"]').children('option').length);
                //console.log($('select[name="shipping_state"]').val());
                console.log("Selecting shipping method");
                $('select[name="shipping_method"]').val($('select[name="shipping_method"] option:eq(1)').val());
            });

            spooky.thenEvaluate(function(){
                  // Inserting credit card information.
                $('input[name="creditcardHolderName"]').val('Maulik Kothari');
                $('input[name="creditcardNumber"]').val('4060320339460843');
                $('select[name="creditCardMonth"]').val('08');
                $('select[name="creditCardYear"]').val('2016');
                $('input[name="creditcardCVV"]').val('490');
            });

            spooky.thenEvaluate(function(){
                // Inserting credit card information.
                $('input[name="billing_firstname"]').val('Maulik');
                $('input[name="billing_lastname"]').val('Kothari');
                $('input[name="billing_address"]').val('2675 E. 7th Street, Apartment E');
                $('input[name="billing_postalcode"]').val('47408');
                $('select[name="billing_country"]').val('US');
                $('select[name="billing_country"]').trigger('change')
                $('select[name="billing_state"]').val('IN');
                $('input[name="billing_city"]').val('Bloomington');
                $('input[name="billing_phone"]').val('8123251316');
            });

            spooky.then(function(){
                this.wait(2000);
            });

            spooky.then(function(){
                this.capture('captures/[Checkout] After filling the details.png');
            });

            spooky.then([{
                  max_price: max_price
                },function(){
                var price_on_page = this.evaluate(function() {      
                  return $('span[id="totalPrice"]').text();
                });
                console.log(price_on_page);
                console.log(max_price);
            }]);

            spooky.run();
        });


    // Uncomment this block to see all of the things Casper has to say.
    // There are a lot.
    // He has opinions.
    spooky.on('console', function (line) {
        console.log(line);
    });

    spooky.on('remote.message', function(message) {
        // this.echo('Message from Remote Server: ' + message);
        console.log('[Inside Evaluate] ' + message);
    });


    spooky.on('hello', function (greeting) {
        console.log(greeting);
    });

    spooky.on('respond_to_callback', function(response){
        callback(response)
    });

    spooky.on('error', function(code, data){
        var errors = {
            'internal_error': 'The retailer you requested is experiencing outages. Please try again or contact support@zinc.io if this error persists.',
            'invalid_request': 'Validation failed on the request.',
            'invalid_quantity' : "The quantity for one of the products does not match the one available on the retailer store." ,
            'invalid_size' : "The size for one of the products does not match the one available on the retailer store.",
            'invalid_product' : "One of the products does not match the one available on the retailer store."
        }
        var response = errors[code];

        if (typeof data === 'undefined')
        {
            response = {
                'success': 'false',
                'code': code,
                'message': errors[code],
            };
        }
        else 
        {  
            response = {
                'success': 'false',
                'code': code,
                'message': errors[code],
                'data': data
            };
        }
        console.log('[Error Response]', JSON.stringify(response));
        spooky.emit('respond_to_callback', response);
        spooky.then(function() {
            this.exit();
        });

        
    })

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });

    return "Spooky Started"
}    

module.exports.start_spooky = start_spooky;