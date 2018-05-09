var mongoose = require('mongoose');
var leanVirtuals = require('mongoose-lean-virtuals');
var selectVirtuals = require('../');

const dbUri = 'mongodb://localhost:27017/mongooseAuthorization';
mongoose.Promise = global.Promise;
mongoose.connect(dbUri);

var schema = new mongoose.Schema({
  real_key: String
});
schema.virtual('virtual_key1').get(function () { return 'v_val1'; });
schema.virtual('virtual_key2').get(function () { return 'v_val2'; });
schema.plugin(leanVirtuals);
schema.plugin(selectVirtuals);
var Model = mongoose.model('t1', schema);

module.exports = {

  setUp: function (callback) {
    Model.create({real_key: 'foo'}, function (err, obj) {
      callback();
    });
  },
  'virtual in select': function (t) {
    t.expect(3);

    Model.find({}, 'real_key virtual_key1').lean({virtuals: true}).exec(function (err, results) {
      t.equal(results[0].real_key, 'foo');
      t.equal(results[0].virtual_key1, 'v_val1');
      t.equal(results[0].virtual_key2, undefined);
      t.done();
    });
  },
  'lean equals true': function (t) {
    t.expect(3);

    Model.find({}, 'real_key virtual_key1').lean().exec(function (err, results) {
      t.equal(results[0].real_key, 'foo');
      t.equal(results[0].virtual_key1, undefined);
      t.equal(results[0].virtual_key2, undefined);
      t.done();
    });
  },
  'not lean': function (t) {
    t.expect(3);

    Model.find({}, 'real_key virtual_key1').exec(function (err, results) {
      t.equal(results[0].real_key, 'foo');
      t.equal(results[0].virtual_key1, 'v_val1');
      t.equal(results[0].virtual_key2, 'v_val2');
      t.done();
    });
  },
  tearDown: function (callback) {
    Model.remove({}, function (err) {
      callback();
    });
  }
};