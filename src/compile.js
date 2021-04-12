/* Copyright (c) 2021, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./share.js";
import bent from 'bent';
import {
  Checker as BasisChecker,
  Transformer as BasisTransformer,
  Compiler as BasisCompiler
//} from '@graffiticode/basis';
} from '../../../../work/graffiticode/basis/index.js';
const getJSON = bent('json');

export class Checker extends BasisChecker {
  constructor(nodePool) {
    super(nodePool);
  }
  check(options, resume) {
    const nid = this.nodePool.root;
    this.visit(nid, options, (err, data) => {
      resume(err, data);
    });
  }
  FETCH(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      const err = [];
      const val = node;
      resume(err, val);
    });
  }
}

export class Transformer extends BasisTransformer {
  constructor(nodePool) {
    super(nodePool);
  }
  check(options, resume) {
    const nid = this.nodePool.root;
    this.visit(nid, options, (err, data) => {
      resume(err, data);
    });
  }
  FETCH(node, options, resume) {
    this.visit(node.elts[0], options, async (e0, v0) => {
      const url = v0;
      const obj = await getJSON(url);
      const err = [];
      const val = obj;
      resume(err, val);
    });
  }
  QUERY(node, options, resume) {
    // https://github.com/graphql/graphql-js
    this.visit(node.elts[0], options, function (e0, v0) {
      this.visit(node.elts[1], options, function (e1, v1) {
        const query = v0;
        const root = v1;
        console.log("query() data=" + JSON.stringify(root));
        const schema = schemaFromObject(root);
        graphql(schema, query, root).then((val) => {
          if (val.errors) {
            resume(val.errors);
          } else {
            resume([].concat(err1).concat(err2), val.data);
          }
        });
      });
    });
    function typeFromValue(name, val) {
      let type;
      if (typeof val === 'boolean') {
        type = GraphQLBoolean;
      } else if (typeof val === 'string') {
        type = GraphQLString;
      } else if (typeof val === 'number') {
        if (Number.isInteger(val)) {
          type = GraphQLInt;
        } else {
          type = GraphQLFloat;
        }
      } else if (val instanceof Array && val.length > 0) {
        type = typeFromValue(name, val[0]);
        assert(type);
        type = new GraphQLList(type);
      } else if (typeof val === 'object' && val !== null && Object.keys(val).length > 0) {
        type = objectTypeFromObject(name, val);
      }
      return type;
    }
    function typeFromArrayOfValues(name, vals) {
      // Create a subtype or union type from an array of values.
      const obj = {};
      if (false && vals.length > 1) {
        vals.forEach(val => {
          // For now, assume elements are objects.
          assert(typeof val === 'object' && val !== null && !(val instanceof Array));
          Object.keys(val).forEach(key => {
            if (obj[key] === undefined) {
              obj[key] = val[key];
            }
          });
        });
      } else {
        obj = vals[0];
      }
      return typeFromValue(name, obj);
    }
    function objectTypeFromObject(name, obj) {
      assert(name !== '0' && name !== '"0"');
      const fields = {};
      Object.keys(obj).forEach(key => {
        const type = typeFromValue(name + '_' + key, obj[key]);
        if (type && isNaN(+key)) {
          fields[key] = {
            type: type,
          };
        }
      });
      return new GraphQLObjectType({
        name: name,
        fields: fields,
      });
    }
    function schemaFromObject(obj) {
      const type = objectTypeFromObject('root', obj);
      return new GraphQLSchema({
        query: type,
      });
    }
  }
}
export const compiler = new BasisCompiler({
  langID: 137,
  version: 'v0.0.0',
  Checker: Checker,
  Transformer: Transformer,
});
