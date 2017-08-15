var customerObject = {
  "customer_id": "980",
  "customer_first_name": "John",
  "customer_last_name": "Smith",
  "customer_email": "test@test.com",
  "customer_date_created": "2016-05-08 23:23:23"
};

module.exports = {

  PluginDiagnosticEvent: {
    "dateCreated" : "2017-05-05T17:00:31",
    "diagnosticType" : "InstallPlugin",
    "description" : "JS SDK",
    "status" : 1
  },

  CartEvent: {
    "order_id": "",
    "price_total": "210.00",
    "qty_total": 1,
    "products": [
      {
        "product_id": "421",
        "product_name": "Elizabeth Knit Top",
        "product_desc": "Loose fitting from the shoulders, open weave knit top. Semi sheer.  Slips on. Faux button closure detail on the back. Linen/Cotton. Machine wash.",
        "product_sku": "wbk013",
        "product_image": "https://1924magento.triggmine.com.ua/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/w/b/wbk012t.jpg",
        "product_url": "https://1924magento.triggmine.com.ua/elizabeth-knit-top-596.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": 210,
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": customerObject
  },

  OrderEvent: {
    "status": "Pending",
    "device_id": "da726552329ab839ea58eef8976fc66d",
    "device_id_1": "1735927330",
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
        "product_image": "https://1924magento.triggmine.com.ua/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/w/b/wbk012t.jpg",
        "product_url": "https://1924magento.triggmine.com.ua/elizabeth-knit-top-596.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": 210,
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": customerObject
  },

  ProspectEvent: customerObject,

  LoginEvent: customerObject,

  LogoutEvent: customerObject,

  NavigationEvent: {
    "user_agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36',
    "products": [
      {
        "product_id": "421",
        "product_name": "Elizabeth Knit Top",
        "product_desc": "Loose fitting from the shoulders, open weave knit top. Semi sheer.  Slips on. Faux button closure detail on the back. Linen/Cotton. Machine wash.",
        "product_sku": "wbk012c",
        "product_image": "https://1924magento.triggmine.com.ua/media/catalog/product/cache/1/image/265x/9df78eab33525d08d6e5fb8d27136e95/w/b/wbk012t.jpg",
        "product_url": "https://1924magento.triggmine.com.ua/elizabeth-knit-top-596.html",
        "product_qty": 1,
        "product_price": 210,
        "product_total_val": "210.0000",
        "product_categories": [
          "New Arrivals",
          "Tops & Blouses"
        ]
      }
    ],
    "customer": customerObject
  },

  HistoryEvents: {
    "orders": [
      {
        "customer": customerObject,
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
            "product_image": "https://1924magento.triggmine.com.ua/media/catalog/product/cache/0/image/265x/9df78eab33525d08d6e5fb8d27136e95/m/s/msj012t_2.jpg",
            "product_url": "https://1924magento.triggmine.com.ua/index.php/catalog/product/view/id/406/s/linen-blazer/",
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
            "product_image": "https://1924magento.triggmine.com.ua/media/catalog/product/cache/0/image/265x/9df78eab33525d08d6e5fb8d27136e95/m/s/msj012t_1.jpg",
            "product_url": "https://1924magento.triggmine.com.ua/index.php/catalog/product/view/id/244/s/linen-blazer/",
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

};


