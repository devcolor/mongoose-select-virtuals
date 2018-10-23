# mongoose-select-virtuals

Allows you to specify which virtuals fields should be returned in find queries when using lean queries.

[Lean](https://mongoosejs.com/docs/api.html#query_Query-lean) queries can be used to improve read only performance. Normally, this means that virtual fields will not be returned. [mongoose-lean-virtuals](https://www.npmjs.com/package/mongoose-lean-virtuals) allows you to specify that virtual properties should be included, even on lean queries. The plugin also allows you to specify which specific virtual fields should be returned. The syntax for that is quite verbose, and requires you to know which fields are real vs virtual. This plugin allows you to specify which fields you would like (real or virtual) using normal `select` properties of a query, and then will make sure the lean fields are returned if this is a virtual query.

### Note
* The plugin has no effect on non-lean queries
* Queries can be set as lean using any style, e.g. `myQuery.lean()`, `myQuery.setOptions({ lean: true })`, `myQuery.lean({virtuals: true})`, etc.
* If only virtual fields are present in the `select` statement, no real properties will be retrieved from the database.
* Specifying a virtual field in the `select` statement will exclude non-specified virtual fields, even if lean is set to `{virtuals: true}` (which would normally trigger all virtuals to be included). `Model.find({}, 'virtual_key').lean()` is the same as `.lean({ virtuals: ['virtual_key']})`.
* If a query has only real fields selected, no virtual fields will be included in the query

## Getting Started

```
const schema = new mongoose.Schema({ real_key: String });
schema.virtual('virtual_key').get(() => 'some virtual value');

schema.plugin(leanVirtuals);
schema.plugin(selectVirtuals);
```

```
// result will contain real_key and virtual_key
const result = await Model.findOne({}, 'real_key virtual_key').lean().exec();
```

### Installing

```
npm install mongoose-select-virtuals mongoose-lean-virtuals
```

## Running the tests

Tests written using [`ava`](https://www.npmjs.com/package/ava) framework. Run them using:

```
npm test
```

## Deployment

Designed for use in node environments, currently no build process. Supports node 6 and above.

## Contributing

Please feel free to fork and submit pull requests

## Versioning

We use [SemVer](http://semver.org/) for versioning and [np](https://www.npmjs.com/package/np) for to publish releases.

## Authors

* **Makinde Adeagbo** - [makinde (github)](https://github.com/makinde)

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
