var assert = require('assert');
var api = require('./../dist/bundle.js');
var fakeData = require('./test-data.js');

var TriggmineApi = new api.TriggmineApi({
  apiUrl: "https://cabinet1502825149.triggmine.com.ua",
  apiKey: "92b2d6baa2364fb9890e219476786d02",
  debug: true
});

var eventsList = [
  'PluginDiagnosticEvent',
  'CartEvent',
  'OrderEvent',
  'ProspectEvent',
  'LoginEvent',
  'LogoutEvent',
  'NavigationEvent',
  'HistoryEvents'
];

var testEventByName = function (eventName) {

  describe('#Event: ' + eventName, function () {

    it('api module should include event' + eventName, function () {
      assert.equal(TriggmineApi.hasOwnProperty(eventName), true);
    });

    var thisEvent = TriggmineApi[eventName];

    it('api event ' + eventName + ' should be a function', function () {
      assert.equal(typeof thisEvent, 'function');
    });

    it('api event ' + eventName + ' should return an object', function () {
      assert.equal(typeof thisEvent(), 'object');
    });

    var eventFields = ['baseUrl', 'eventType', 'eventUrl'];

    for (var i = 0; i < eventFields.length; i++) {

      var fieldName = eventFields[i];

      it('api event ' + eventName + ' should have ' + fieldName  +' key', function () {
        assert.equal(thisEvent().hasOwnProperty(fieldName), true);
      });

      it('api event ' + eventName + ' should have ' + fieldName  +' key value defined', function () {
        assert.equal(thisEvent()[fieldName] == "" || thisEvent()[fieldName] == undefined, false);
      });
    }

    it(eventName +' should post with no error', function (done) {

      TriggmineApi.sendEvent(new TriggmineApi[eventName](fakeData[eventName]),
        function (response, event) { //success callback

          describe('#' + eventName + ' Response status code', function () {
            it(eventName + ' should respond with 200 or 201 status', function () {
              assert.equal(response.status == 200 || response.status == 201, true);
            });
          });

          done();
        },
        function (err, event) { //error callback
          done(err);
        })
    });

  });

};

describe('TriggmineApi', function() {

  describe('#typeof Object', function() {
    it('api module should be an object', function() {
      assert.equal(typeof TriggmineApi, 'object');
    });
  });

  describe('#Send Event', function() {
    it('api module should have \'sendEvent\' method', function() {
      assert.equal(TriggmineApi.sendEvent && typeof TriggmineApi.sendEvent == 'function', true);
    });
  });

  eventsList.forEach(function (eventName) {
    testEventByName(eventName);
  });

});