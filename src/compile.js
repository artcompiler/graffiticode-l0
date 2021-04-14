/* Copyright (c) 2021, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./share.js";
import * as d3 from 'd3-array';
import bent from 'bent';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import {
  Checker as BasisChecker,
  Transformer as BasisTransformer,
  Compiler as BasisCompiler
} from '@graffiticode/basis';
//} from '../../../../work/graffiticode/basis/index.js';
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
  QUERY(node, options, resume) {
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
    this.visit(node.elts[0], options, (e0, v0) => {
      this.visit(node.elts[1], options, (e1, v1) => {
        const query = v0;
        const root = v1;
        const schema = schemaFromObject(root);
        graphql(schema, query, root).then((val) => {
          console.log("QUERY() val=" + JSON.stringify(val, null, 2));
          if (val.errors) {
            resume([], val);
          } else {
            resume([].concat(e0).concat(e1), val.data);
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
    function normalizeName(name) {
      return name.replace(/[()\ ]/g, '_');
    }
    function objectTypeFromObject(name, obj) {
      name = normalizeName(name);
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



const path = [
  'Brands/Boards.Type',
  'Brands.Name',
  'Brands/Boards.Name',
];

const root = {
  Brands: [{
    Name: "FooBrand",
    Boards: [{
      Name: "AA",
      Spec: {
        Type: "X",
        Size: 10,
      },
    }, {
      Name: "AB",
      Spec: {
        Type: "X",
        Size: 20,
      },
    }, {
      Name: "AC",
      Spec: {
        Type: "Y",
        Size: 30,
      },
    }]
  }, {
    Name: "BarBrand",
    Boards: [{
      Name: "BA",
      Spec: {
        Type: "X",
        Size: 10,
      },
    }, {
      Name: "BB",
      Spec: {
        Type: "X",
        Size: 20,
      },
    }]
  }, {
    Name: "BazBrand",
    Boards: [{
      Name: "CA",
      Spec: {
        Type: "X",
        Size: 10,
      },
    }]
  }],
};

const shape = ['Boards.Type', 'Boards.Name']

function list(parentName, root) {
  console.log("list() root=" + JSON.stringify(root, null, 2));
  let rows = [];
  root.forEach(node => {
    let row = {};
    if (node instanceof Array) {
      node.forEach(child => {
        rows = rows.concat(record(parentName, child));
      });
    } else if (typeof node === 'object' && node !== null) {
      rows = rows.concat(record(parentName, node));
    } else {
      row[parentName] = node;
      rows.push(row);
    }
  });
  console.log("list() rows=" + JSON.stringify(rows, null, 2));
  return rows;
}

function record(parentName, root) {
  console.log("record() root=" + JSON.stringify(root, null, 2));
  let records = [];
  let row = {};
  Object.keys(root).forEach(key => {
    const name = `${parentName}/${key}`;
    const node = root[key];
    if (node instanceof Array) {
      records = records.concat(list(name, node));
    } else if (typeof node === 'object' && node !== null) {
      records = records.concat(record(name, node));
    } else {
      row[name] = node;
    }
  });
  const rows = [];
  if (records.length > 0) {
    records.forEach(record => {
      console.log("record() record=" + JSON.stringify(record));
      rows.push(Object.assign({}, row, record));
    });
  } else {
    rows.push(row);
  }
  console.log("record() rows=" + JSON.stringify(rows, null, 2));
  return rows;
}

function table(root) {
  const rows = [];
  if (root instanceof Array) {
    const row = list('', root);
    rows.push(row);
  } else {
    const row = record('', root);
    rows.push(row);
  }
  console.log("table() rows=" + JSON.stringify(rows, null, 2));
  return rows[0];
}

const groups = d3.groups(table(root, []), d => d['/Brands/Boards/Spec/Type'], d => d['/Brands/Name'], d => d['/Brands/Boards/Name']);;
console.log("groups=" + JSON.stringify([...groups.entries()]));
