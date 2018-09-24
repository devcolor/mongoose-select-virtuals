module.exports = function selectVirtuals(schema) {
  function preFind(next) {
    if (!this.selected() || !this._mongooseOptions.lean) {
      return next();
    }

    var selection = this._fields;
    var virtualFields = [];

    Object.keys(selection).forEach(function (path) {
      if (schema.pathType(path) === 'virtual') {
        virtualFields.push(path);
        delete selection[path];
      }
    });

    if (virtualFields.length > 0) {
      if (this._mongooseOptions.lean === true) {
        this._mongooseOptions.lean = {};
      }
      this._mongooseOptions.lean.virtuals = virtualFields;

      // At this point there was at least one virtual field mentioned in the selection. If
      // there are no more fields left in the selection, it means only virtual fields
      // were selected and we shouldn't return any real fields. We need to explcitly set
      // only the `_id` field to come back since leaving the selection object blank would
      // return all real fields.
      if (Object.keys(selection).length === 0) {
        selection['_id'] = 1;
      }
    }

    next();
  }

  schema.pre('find', preFind);
  schema.pre('findOne', preFind);
  schema.pre('findOneAndUpdate', preFind);
};