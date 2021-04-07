/* Copyright (c) 2021, ARTCOMPILER INC */
import {assert, message, messages, reserveCodeRange} from "./share.js";
import {BasisCompiler} from '@graffiticode/basis';
//import {BasisCompiler} from '../../../../work/graffiticode/basis/index.js';
export const compiler = new BasisCompiler({
  langID: 0,
  version: 'v0.0.0',
});
