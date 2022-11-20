// This module provides some functions for encoding and decoding
// terminal text, which makes the main body of the program
// much less messy.
const texthelper = {
  red : (text) => {return '\x1b[31m'+text+'\x1b[0m';},
  yellow : (text) => {return '\x1b[33m'+text+'\x1b[0m';},
  green : (text) => {return '\x1b[32m'+text+'\x1b[0m';},
  cyan : (text) => {return '\x1b[36m'+text+'\x1b[0m';},
  blue : (text) => {return '\x1b[34m'+text+'\x1b[0m';},
  purple : (text) => {return '\x1b[35m'+text+'\x1b[0m';},
  white : (text) => {return '\x1b[37m'+text+'\x1b[0m';},
  black : (text) => {return '\x1b[30m'+text+'\x1b[0m';},
  default : (text) => {return '\x1b[39m'+text+'\x1b[0m';},
  decode: (text) => {return text.slice(5,-4);}
}

module.exports = texthelper;