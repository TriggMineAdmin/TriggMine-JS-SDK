var TriggmineApi = (function () {
  'use strict';

  var apiModuleInstance;
  var moduleConfig;
  var deviceId = new Fingerprint().get();
  var deviceId1 =  new ClientJS().getFingerprint();
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


  var pluginDiagnosticEvent = {
    "dateCreated" : getDateTime(),
    "diagnosticType" : "InstallPlugin",
    "description" : "JS SDK",
    "status" : 1
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
    return obj && typeof obj == 'object';
  }


  /**
   * @constructor
   * @param {Object} opts - event parameters
   * @param {string} opts.baseUrl - event base API URL
   * @param {string} opts.eventType - event type
   * @param {string} opts.eventUrl - event API endpoint URL
   * @param {Object} opts.data - event data in JSON format
   *
   */
  var BaseEvent = function (opts) {
    if(!opts) return;
    this.baseUrl   = opts.baseUrl || '';
    this.eventType = opts.eventType;
    this.eventUrl  = opts.eventUrl;
    this.data      = opts.data;
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
   * @param {Object} reqData - event JSON object
   * @param {boolean} lowLevel - is low level object flag
   * @returns {*}
   */
  function _setRequestDeviceInfo (reqData, lowLevel) {
    var obj;
    if(reqData && isObject(reqData)) {
      obj = reqData;
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
   * @param {function} debugSuccessCallback
   * @param {function} debugErrorCallback
   */
  function _sendEvent (baseEvent, debugSuccessCallback, debugErrorCallback) {

    if(!baseEvent) {
      throw new Error("TriggMine API: Event not specified!");
    }

    if(!baseEvent.data) {
      throw new Error("TriggMine API: Event data not set!");
    }

    var headers = {
      headers: {
        ApiKey: moduleConfig.apiKey
      }
    };

    /**
     *
     * @param {string} eventUrl
     * @param {Object} eventData
     * @param {Object} headers
     * @returns {Function}
     */
    var postEvent = function (eventUrl, eventData, headers) {
      return axios.post(eventUrl, _setRequestDeviceInfo(eventData), headers);
    };

    /**
     * Logging errors
     * @param {string} msg
     */
    var logger = function (msg) {
      if(window.console && window.console.error) {
        console.error(msg);
      }
    };

    /**
     * Parses response error messages
     * @param {Object} error
     * @param {BaseEvent} baseEvent
     */
    var errorLog = function (error, baseEvent) {
      if(error && typeof error == 'object' && error.response && error.response.data) {
        var errData = error.response.data;
        if(errData.hasOwnProperty('Message')) {
          logger(errData['Message'] + ' --- ' + baseEvent.eventUrl + ' (' + baseEvent.eventType + ')');
        }

        if(errData.hasOwnProperty('ModelState')) {
          var state = errData['ModelState'];
          for(var x in state) {
            if(state.hasOwnProperty(x)) {
              logger(state[x].join(' '));
            }
          }
        }
      }
    };

    if(moduleConfig.debug) {
      postEvent(baseEvent.getApiUrl(), baseEvent.data, headers)
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
            errorLog(error, baseEvent);
          }
        }
      });
    } else {
      postEvent(baseEvent.getApiUrl(), baseEvent.data, headers);
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
     * */
    return function (data) {
      return new BaseEvent({
        baseUrl: base,
        eventType: type,
        eventUrl: url,
        data: data
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
  var moduleAPI = function (cfg) {

    if (typeof apiModuleInstance == 'undefined') {

      if(!cfg) {
        throw new Error("TriggMine: API Config not provided!");
      }

      if(!cfg.hasOwnProperty('apiUrl')) {
        throw new Error("TriggMine: API URL not provided! (apiUrl)");
      }

      if(!isUrl(cfg.apiUrl)) {
        throw new Error("TriggMine: Wrong API URL Format!");
      }

      if(!cfg.hasOwnProperty('apiKey')) {
        throw new Error("TriggMine: API key not provided! (apiKey)");
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

  return moduleAPI;
})();