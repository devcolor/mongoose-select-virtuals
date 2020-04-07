const test = require('ava');
const mongoose = require('mongoose');
const leanVirtuals = require('mongoose-lean-virtuals');
const { MongoMemoryServer } = require('mongodb-memory-server');
const selectVirtuals = require('../');

const schema = new mongoose.Schema({
  real_key: String
});
schema.virtual('virtual_key1').get(() => 'v_val1');
schema.virtual('virtual_key2').get(() => 'v_val2');
schema.plugin(leanVirtuals);
schema.plugin(selectVirtuals);

const Model = mongoose.model('t1', schema);
let mongoServer;

test.before(async () => {
  mongoServer = new MongoMemoryServer();
  const uri = await mongoServer.getConnectionString();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  await Model.create({ real_key: 'foo' });
});

test('Virtual field in select, lean set to `virtuals:true`', async t => {
  const result = await Model.findOne({}, 'real_key virtual_key1').lean({virtuals: true}).exec();
  t.is(result.real_key, 'foo');
  t.is(result.virtual_key1, 'v_val1');
  t.is(result.virtual_key2, undefined);
});

test('Virtual field in select, lean set to `true`', async t => {
  const result = await Model.findOne({}, 'real_key virtual_key1').lean().exec();
  t.is(result.real_key, 'foo');
  t.is(result.virtual_key1, 'v_val1');
  t.is(result.virtual_key2, undefined);
});

test('Only a virtual field is in the select', async t=> {
  const result = await Model.findOne({}, 'virtual_key1').lean().exec();
  t.is(result.real_key, undefined, 'Real fields should be excluded if not specified');
  t.is(result.virtual_key1, 'v_val1');
  t.is(result.virtual_key2, undefined);
});

test('Query is not lean', async t => {
  const result = await Model.findOne({}, 'real_key virtual_key1').exec();
  t.is(result.real_key, 'foo', 'Real properties should be returned');
  t.is(result.virtual_key1, 'v_val1', 'All virtuals should be returned');
  t.is(result.virtual_key2, 'v_val2', 'All virtuals should be returned');
});

test('No fields selected on lean query', async t => {
  const result = await Model.findOne({}).lean().exec();
  t.is(result.real_key, 'foo');
  t.is(result.virtual_key1, undefined, 'No virtuals should be returned');
  t.is(result.virtual_key2, undefined, 'No virtuals should be returned');
});

test('Only a real key in selection w/ lean virtuals', async t=> {
  const result = await Model.findOne({}, 'real_key').lean({virtuals: true}).exec();
  t.is(result.real_key, 'foo');
  t.is(result.virtual_key1, undefined, 'No virtuals should be returned');
  t.is(result.virtual_key2, undefined, 'No virtuals should be returned');
});

test.after.always(async () => {
  await Model.deleteMany({});
  await mongoose.disconnect();
  await mongoServer.stop();
});