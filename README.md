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


## Examples

Sending events with Browser

```js
    
    var triggmineApi = new TriggmineApi({
        apiUrl: "YOUR API URL",
        apiKey: "YOUR API KEY"
    });
    
    /**
    * Notice that there's no need to pass 'device_id' & 'device_id_1' parameters,
    * as those are captured by SDK automatically 
    */
    var prospectEvent = new triggmineApi.ProspectEvent({
        customer_first_name: "John",        
        customer_last_name: "Smith",
        customer_email: "john.smith@email.com",
        customer_id: "123",        
        customer_date_created: "2016-05-08 23:23:23",
    });
    
    triggmineApi.sendEvent(prospectEvent);
    
```

Sending events with Node.js

```js
    
    var triggmineApi = new TriggmineApi({
        apiUrl: "YOUR API URL",
        apiKey: "YOUR API KEY"
    });
    
    var device_id = "4c3d48512d48b2603092b5a45ba74c8c";
    var device_id_1 = "2056010100";
    
    var eventData = {
        customer_first_name: "John",        
        customer_last_name: "Smith",
        customer_email: "john.smith@email.com",
        customer_id: "123",        
        customer_date_created: "2016-05-08 23:23:23",
    };
       
    /**
    * Passing 'device_id' & 'device_id_1' parameters into the event constructor
    */
    var prospectEvent = new triggmineApi.ProspectEvent(eventData, device_id, device_id_1); 
    
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

Sources
https://clientjs.org/
https://valve.github.io/fingerprintjs/

Customer Id** - Unique Customer Id in your database.

### Event data examples

PluginDiagnosticEvent:
```js
{
    "dateCreated" : "2017-05-05T17:00:31",
    "diagnosticType" : "InstallPlugin",
    "description" : "JS SDK",
    "status" : 1
}   
```

CartEvent:
```js
{
    "order_id": "",
    "price_total": "210.00",
    "qty_total": 1,
    "products": [
      {
        "product_id": "421",
        "product_name": "Elizabeth Knit Top",
        "product_desc": "Loose fitting from the shoulders, open weave knit top. Semi sheer.  Slips on. Faux button closure detail on the back. Linen/Cotton. Machine wash.",
        "product_sku": "wbk013",
        "product_image": "https://example.com/public/image/image.jpg",
        "product_url": "https://example.com/page.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": 210,
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": {
      "device_id": "da726552329ab839ea58eef8976fc66d",
      "device_id_1": "1735927330",
      "customer_id": "980",
      "customer_first_name": "John",
      "customer_last_name": "Smith",
      "customer_email": "test@test.com",
      "customer_date_created": "2016-05-08 23:23:23"
    }
}   
```

OrderEvent:
```js
{
    "status": "Pending",    
    "prospect_id": "192",
    "order_id": "763",
    "price_total": "210.00",
    "qty_total": 1,
    "products": [
      {
        "product_id": "421",
        "product_name": "Elizabeth Knit Top",
        "product_desc": "Loose fitting from the shoulders, open weave knit top. Semi sheer.  Slips on. Faux button closure detail on the back. Linen/Cotton. Machine wash.",
        "product_sku": "wbk013",
        "product_image": "https://example.com/public/image/image.jpg",
        "product_url": "https://example.com/page.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": 210,
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": {
      "device_id": "da726552329ab839ea58eef8976fc66d",
      "device_id_1": "1735927330",
      "customer_id": "980",
      "customer_first_name": "John",
      "customer_last_name": "Smith",
      "customer_email": "test@test.com",
      "customer_date_created": "2016-05-08 23:23:23"
    }
  }   
```

ProspectEvent:
```js
{
  "device_id": "da726552329ab839ea58eef8976fc66d",
  "device_id_1": "1735927330",
  "customer_id": "980",
  "customer_first_name": "John",
  "customer_last_name": "Smith",
  "customer_email": "test@test.com",
  "customer_date_created": "2016-05-08 23:23:23"
}
```

LoginEvent:
```js
{
  "device_id": "da726552329ab839ea58eef8976fc66d",
  "device_id_1": "1735927330",
  "customer_id": "980",
  "customer_first_name": "John",
  "customer_last_name": "Smith",
  "customer_email": "test@test.com",
  "customer_date_created": "2016-05-08 23:23:23"
}
```

LogoutEvent:
```js
{
  "device_id": "da726552329ab839ea58eef8976fc66d",
  "device_id_1": "1735927330",
  "customer_id": "980",
  "customer_first_name": "John",
  "customer_last_name": "Smith",
  "customer_email": "test@test.com",
  "customer_date_created": "2016-05-08 23:23:23"
}
```

NavigationEvent:
```js
{
    "user_agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36',
    "products": [
      {
        "product_id": "421",
        "product_name": "Elizabeth Knit Top",
        "product_desc": "Loose fitting from the shoulders, open weave knit top. Semi sheer.  Slips on. Faux button closure detail on the back. Linen/Cotton. Machine wash.",
        "product_sku": "wbk012c",
        "product_image": "https://example.com/public/image/image.jpg",
        "product_url": "https://example.com/page.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": "210.0000",
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": {
      "device_id": "da726552329ab839ea58eef8976fc66d",
      "device_id_1": "1735927330",
      "customer_id": "980",
      "customer_first_name": "John",
      "customer_last_name": "Smith",
      "customer_email": "test@test.com",
      "customer_date_created": "2016-05-08 23:23:23"
    }
}
```

HistoryEvents
```js
{
    "orders": [
           {
             "customer": {
               "device_id": "da726552329ab839ea58eef8976fc66d",
               "device_id_1": "1735927330",
               "customer_id": "980",
               "customer_first_name": "John",
               "customer_last_name": "Smith",
               "customer_email": "test@test.com",
               "customer_date_created": "2016-05-08 23:23:23"
             },
             "order_id": "246",
             "date_created": "2016-10-08 10:20:37",
             "status": "pending",
             "price_total": "455.00",
             "qty_total": "1",
             "products": [
               {
                 "product_id": "406",
                 "product_name": "Linen Blazer",
                 "product_desc": "Single vented, notched lapels. Flap pockets. Tonal stitching. Fully lined. Linen. Dry clean.",
                 "product_sku": "msj013",
                 "product_image": "https://example.com/public/image/image.jpg",
                 "product_url": "https://example.com/page.html",
                 "product_qty": 1,
                 "product_price": 455,
                 "product_total_val": "455.0000",
                 "product_categories": [
                   "Men",
                   "New Arrivals",
                   "Blazers"
                 ]
               },
               {
                 "product_id": "244",
                 "product_name": "Linen Blazer",
                 "product_desc": "Single vented, notched lapels. Flap pockets. Tonal stitching. Fully lined. Linen. Dry clean.",
                 "product_sku": "msj013",
                 "product_image": "https://example.com/public/image/image2.jpg",
                 "product_url": "https://example.com/page2.html",
                 "product_qty": 1,
                 "product_price": 455,
                 "product_total_val": "0.0000",
                 "product_categories": [
                   "Blazers"
                 ]
               }
             ]
           }
         ]
}
```

Note: 'device_id' and 'device_id_1' are automatically captured when using TriggMine SDK in a Browser.

