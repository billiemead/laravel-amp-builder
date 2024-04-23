import Parchment from 'parchment';

let config = {
  scope: Parchment.Scope.INLINE,
  whitelist: ['none','lowercase','uppercase', 'capitalize']
};

let TransformAttribute = new Parchment.Attributor.Attribute('transform', 'transform', config);
let TransformClass = new Parchment.Attributor.Class('transform', 'ql-transform', config);
let TransformStyle = new Parchment.Attributor.Style('transform', 'text-transform', config);

export { TransformAttribute, TransformClass, TransformStyle };
