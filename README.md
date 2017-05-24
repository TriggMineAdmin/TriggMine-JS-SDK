# TriggMine JavaScript SDK
## Description
TriggMine is an automated email marketing platform, tailored to the eCommerce needs. We've harnessed the power of behavioral-based email workflows! In real time, our system automatically tracks customers behavior and separates them into highly relevant, behavior-focused segments and sends them highly personalized emails.

It takes less than 30 minutes to launch fully automated email campaign! Now marketers can finally watch your email open rates, clicks and sales sky rocket, without hiring tech experts or touching a single line of code!

TriggMine web site: http://www.triggmine.com/

Using npm:

```bash
$ npm install triggmine-js-sdk
```

Using bower:

```bash
$ bower install triggmine-js-sdk
```

Browser (using cdn):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs/0.5.3/fingerprint.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.1.11/client.min.js"></script>
<script src="dist/bundle.js"></script>
```


## Example

Sending events

```js
    
    var triggmineApi = new TriggmineApi({
        apiUrl: "YOUR API URL",
        apiKey: "YOUR API KEY"
    });
    
    var prospectEvent = new triggmineApi.ProspectEvent({
        customer_first_name: "John",        
        customer_last_name: "Smith",
        customer_email: "john.smith@email.com",
        customer_id: "123",
        device_id: "4c3d48512d48b2603092b5a45ba74c8c",
        device_id_1: "2056010100",
        customer_date_created: "2016-05-08 23:23:23",
    });
    
    triggmineApi.sendEvent(prospectEvent);
    
```

Debugging

```js

    var triggmineApi = new TriggmineApi({
        apiUrl: "YOUR API URL",
        apiKey: "YOUR API KEY",
        debug: true
    });
    
    var prospectEvent = new triggmineApi.ProspectEvent({
        customer_first_name: "John",        
        customer_last_name: "Smith",
        customer_email: "john.smith@email.com",
        customer_id: "123",
        device_id: "4c3d48512d48b2603092b5a45ba74c8c",
        device_id_1: "2056010100",
        customer_date_created: "2016-05-08 23:23:23",
    });
    
    var successCallback = function (response, Event) {
        console.log('SUCCESS: ' + response);
    };
    
    var errCallback = function (response, Event) {
        console.log('ERROR: ' + response);
    };
    
    triggmineApi.sendEvent(prospectEvent, successCallback, errCallback);    
    
```



### Event data fields description
**Field** | **Description**|
--|--|
device_id|Device hash FingerprintJS*|
device_id1|Device hash ClientJS*|
customer_email|Customer Email|
customer_first_name|Customer First Name|
customer_id|Customer Id**|
customer_last_name|Customer Last Name|
order_id|Order Id|
status|Order status Pending, Paid, Closed|
price_total|Total amount of order|
product_categories|Item categories|
product_desc|Item description|
product_id|Item ID|
product_image|Item full path image|
product_name|Item name|
product_price|Item price|
product_qty|Item quantity|
product_sku|Item vendor code| 
product_total_val|Item summary price|
product_url|Item full path url|
qty_total|Order quantity|
customer_date_created|Customer Registration Date|
user_agent|navigator.userAgent. Optional parameter|

Device hash ClientJS*, FingerprintJS*
Customer Id** - Unique Customer Id in your database.

