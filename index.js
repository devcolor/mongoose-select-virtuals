module.exports = function selectVirtuals(schema) {
  function preFind(next) {
    if (!this.selected()
      || !this._mongooseOptions.lean
      || !this._mongooseOptions.lean.virtuals
      || this._mongooseOptions.lean.virtuals.length) {
      return;
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
      this._mongooseOptions.lean.virtuals = virtualFields;
    }

    next();
  }

  schema.pre('find', preFind);
  schema.pre('findOne', preFind);
  schema.pre('findOneAndUpdate', preFind);
};