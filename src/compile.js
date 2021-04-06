/* Copyright (c) 2021, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./share.js";
//import {BasisChecker, BasisTransformer, BasisRenderer} from '../../../../work/graffiticode/basis/index.js';
import {BasisChecker, BasisTransformer, BasisRenderer} from '@graffiticode/basis';

class Checker extends BasisChecker {}
class Transformer extends BasisTransformer {}
class Renderer extends BasisRenderer {}
//class Compiler extends BasisCompiler {}
//export const compiler = new Compiler(Checker, Transformer, Renderer);

export const compiler = (function () {
  return {
    langID: 0,
    version: "v0.0.0",
    compile: function compile(code, data, config, resume) {
      // Compiler takes an AST in the form of a node pool (code) and transforms it
      // into an object to be rendered on the client by the viewer for this
      // language.
      try {
        let options = {
          data: data,
          config: config,
          result: '',
        };
        const checker = new Checker(code);
        checker.check(options, (err, val) => {
          const transformer = new Transformer(code);
          transformer.transform(options, function (err, val) {
            if (err && err.length) {
              resume(err, val);
            } else {
              const renderer = new Renderer(val);
              renderer.render(options, (err, val) => {
                val = !(val instanceof Array) && [val] || val;
                resume(err, val);
              });
            }
          });
        });
      } catch (x) {
        console.log("ERROR with code");
        console.log(x.stack);
        resume([{
          statusCode: 500,
          error: "Compiler error"
        }]);
      }
    },
  };
})();
