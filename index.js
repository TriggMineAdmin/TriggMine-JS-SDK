;(function () {
  'use strict';

  var ERR_PREFIX = 'TriggMine API: ';
  var axios = require('axios');
  var apiModuleInstance;
  var moduleConfig;
  var deviceId = '';
  var deviceId1 =  '';

  if(typeof Fingerprint == 'function') {
    deviceId = new Fingerprint().get();
  }

  if(typeof ClientJS == 'function') {
    deviceId1 =  new ClientJS().getFingerprint();
  }

  /**
   * Event Name-to-Endpoint Map
   */
  var eventsEndpointMap = {
    PluginDiagnosticEvent: '/control/api/plugin/onDiagnosticInformationUpdated',
    CartEvent: '/api/events/cart',
    OrderEvent: '/api/events/order',
    ProspectEvent: '/api/events/prospect/registration',
    LoginEvent: '/api/events/prospect/login',
    LogoutEvent: '/api/events/prospect/logout',
    NavigationEvent: '/api/events/navigation',
    HistoryEvents: '/api/events/history'
  };


  /**
   * PluginDiagnosticEvent object - is sent to the server in debug mode to initialize the integration
   */
  var pluginDiagnosticEvent = {
    "dateCreated" : getDateTime(),
    "diagnosticType" : "InstallPlugin",
    "description" : "JS SDK",
    "status" : 1
  };


  /**
   * Logging errors
   * @param {string} msg
   */
  var errLogger = function (msg) {
    if(window.console && window.console.error) {
      console.error(ERR_PREFIX + msg);
    }
  };


  /**
   *
   * @returns {string} - current date and time (YYYY-MM-DDThh:mm:ss)
   */
  function getDateTime () {
    var leadingZeroFormat = function (num) {
      return num < 10 ? '0'+num : num;
    };
    var date = new Date();
    var hours = leadingZeroFormat(date.getHours());
    var minutes = leadingZeroFormat(date.getMinutes());
    var seconds = leadingZeroFormat(date.getSeconds());
    var strTime = hours + ':' + minutes + ':' + seconds;
    return date.getFullYear() + '-'+ date.getMonth()+1 + '-' + date.getDate() + "T" + strTime;
  }


  /**
   *
   * @param {*} obj
   * @returns {boolean}
   */
  function isArray (obj) {
    return obj && Object.prototype.toString.call(obj) === '[object Array]';
  }


  /**
   *
   * @param {*} obj
   * @returns {boolean}
   */
  function isObject (obj) {
    var isObj = obj != null && Object.prototype.toString.call(obj) === '[object Object]';
    if(!isObj) {
      errLogger('Incorrect data format (is not an object)');
    }
    return isObj;
  }


  /**
   * @constructor
   * @param {Object} opts - event parameters
   * @param {string} opts.baseUrl - event base API URL
   * @param {string} opts.eventType - event type
   * @param {string} opts.eventUrl - event API endpoint URL
   * @param {Object} opts.data - event data in JSON format
   * @param {Object} [opts.deviceId] - device ID generated by Fingerprint.js  (required when using SDK with node.js)
   * @param {Object} [opts.deviceId1] - device ID generated by ClientJS  (required when using SDK with node.js)
   *
   */
  var BaseEvent = function (opts) {
    if(!opts) return;
    this.baseUrl   = opts.baseUrl || '';
    this.eventType = opts.eventType;
    this.eventUrl  = opts.eventUrl;
    this.data      = opts.data;
    this.deviceId  = opts.deviceId || '';
    this.deviceId1 = opts.deviceId1 || '';
  };


  /**
   *
   * @returns {string} - full API url
   */
  BaseEvent.prototype.getApiUrl = function () {
    return this.baseUrl + this.eventUrl;
  };


  /**
   *
   * @param {BaseEvent} baseEvent
   * @param {boolean} [lowLevel] - is low level object flag
   * @returns {*}
   */
  function _setRequestDeviceInfo (baseEvent, lowLevel) {
    var obj = baseEvent.data;
    if(obj && isObject(obj) && !baseEvent.deviceId && !baseEvent.deviceId1) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key)) {

          //setting device ids for each request in top level object
          if(!lowLevel && !isArray(obj[key])) {
            obj['device_id'] = deviceId;
            obj['device_id_1'] = deviceId1;
          }

          //setting device ids for each 'customer' object
          if(key.toLowerCase() == 'customer' && !isArray(obj[key])) {
            obj[key]['device_id'] = deviceId;
            obj[key]['device_id_1'] = deviceId1;
            continue;
          }

          //setting device ids only for customer objects in collections
          if(isArray(obj[key])) {
            var arr = obj[key];
            for(var i = 0; i < arr.length; i++) {
              _setRequestDeviceInfo(arr[i], true);
            }
          }
        }
      }
    }
    return obj;
  }


  /**
   *
   * @param {BaseEvent} baseEvent
   * @param {function} [debugSuccessCallback]
   * @param {function} [debugErrorCallback]
   */
  function _sendEvent (baseEvent, debugSuccessCallback, debugErrorCallback) {

    if(!baseEvent) {
      throw new Error(ERR_PREFIX + 'Event not specified!');
    }

    if(!baseEvent.data) {
      throw new Error(ERR_PREFIX + 'Event data not set!');
    }

    var headers = {
      headers: {
        ApiKey: moduleConfig.apiKey
      }
    };

    /**
     *
     * @param {BaseEvent} baseEvent
     * @param {Object} headers - http request headers
     * @returns {Function}
     */
    var postEvent = function (baseEvent, headers) {
      return axios.post(baseEvent.getApiUrl(), _setRequestDeviceInfo(baseEvent), headers);
    };


    /**
     * Parses response error messages
     * @param {Object} error
     * @param {BaseEvent} baseEvent
     */
    var errParser = function (error, baseEvent) {
      if(error && typeof error == 'object' && error.response && error.response.data) {
        var errData = error.response.data;
        if(errData.hasOwnProperty('Message')) {
          errLogger(errData['Message'] + ' --- ' + baseEvent.eventUrl + ' (' + baseEvent.eventType + ')');
        }

        if(errData.hasOwnProperty('ModelState')) {
          var state = errData['ModelState'];
          for(var x in state) {
            if(state.hasOwnProperty(x)) {
              errLogger(state[x].join(' '));
            }
          }
        }
      }
    };

    if(moduleConfig.debug) {
      postEvent(baseEvent, headers)
        .then(function (response) {
        if(moduleConfig.debug && typeof debugSuccessCallback == 'function') {

          /**
           * @param {Object} response
           * @param {BaseEvent} baseEvent
           */
          debugSuccessCallback(response, baseEvent);
        }
      })
        .catch(function (error) {
        if(moduleConfig.debug) {
          if(typeof debugErrorCallback == 'function') {
            /**
             * @param {Object} response
             * @param {BaseEvent} baseEvent
             */
            debugErrorCallback(error, baseEvent);
          } else {
            errParser(error, baseEvent);
          }
        }
      });
    } else {
      postEvent(baseEvent, headers);
    }
  }


  /**
   * Checks the URL format
   * @param {string} urlStr
   * @returns {boolean}
   */
  var isUrl = function (urlStr) {
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(urlRegex);
    return regex.test(urlStr);
  };


  /**
   * Creates Public Event Constructors
   * @param {string} type
   * @param {string} url - API endpoint
   * @param {string} base - API base URL
   * @returns {Function}
   */
  var createEventConstructor = function (type, url, base) {
    /**
     * @param {Object} data - JSON event Data
     * @param {string} [deviceId] - FingerprintJS device hash (required when using SDK with node.js)
     * @param {string} [deviceId1] - Client.js device hash (required when using SDK with node.js)
     * */
    return function (data, deviceId, deviceId1) {
      return new BaseEvent({
        baseUrl: base,
        eventType: type,
        eventUrl: url,
        data: data,
        deviceId: deviceId,
        deviceId1: deviceId1
      });
    };
  };


  /**
   * Sends 'PluginDiagnosticEvent' in debug mode to initialize integration
   * @param {Object} moduleInst - TriggMine API module instance
   */
  var installJsSdk = function (moduleInst) {
      if(moduleInst) {
        moduleInst.sendEvent(new moduleInst.PluginDiagnosticEvent(pluginDiagnosticEvent));
      }
  };


  /**
   * Initializes TriggMine API module
   * @private
   */
  var _initModule = function () {
    for(var eventType in eventsEndpointMap) {
      if(eventsEndpointMap.hasOwnProperty(eventType)) {
        var eventUrl = eventsEndpointMap[eventType];
        apiModuleInstance[eventType] = createEventConstructor(eventType, eventUrl, moduleConfig.apiUrl);
      }
    }
    apiModuleInstance.sendEvent = _sendEvent;

    if(moduleConfig.debug) {
      installJsSdk(apiModuleInstance);
    }
  };


  /**
   *
   * @param {Object} cfg
   * @param {string} cfg.apiUrl - TriggMine API unique URL
   * @param {string} cfg.apiKey - TriggMine API key
   * @param {boolean} [cfg.debug] - debug mode
   * @returns {TriggmineApi}
   */
  var _TriggmineApi = function (cfg) {

    if (typeof apiModuleInstance == 'undefined') {

      if(!cfg) {
        throw new Error(ERR_PREFIX + 'API Config not provided!');
      }

      if(!cfg.apiUrl) {
        throw new Error(ERR_PREFIX + 'API URL not provided! (apiUrl)');
      }

      if(!isUrl(cfg.apiUrl)) {
        throw new Error(ERR_PREFIX + 'Wrong API URL Format!');
      }

      if(!cfg.apiKey) {
        throw new Error(ERR_PREFIX + 'API key not provided! (apiKey)');
      }

      if(this == undefined) {
        return new TriggmineApi(cfg);
      }

      apiModuleInstance = this;
      moduleConfig = cfg;
      _initModule();
    }

    return apiModuleInstance;
  };

  if (typeof window === 'undefined') {
    exports.TriggmineApi = _TriggmineApi;
  } else {
    window.TriggmineApi = _TriggmineApi;
  }

})();