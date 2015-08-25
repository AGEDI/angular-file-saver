(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularFileSaver = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/* angular-file-saver
*
* A AngularJS service that implements the HTML5 W3C saveAs() in browsers that
* do not natively support it
*
* (c) 2015 Philipp Alferov
* License: MIT
*
*/

function handleErrors (msg) {
  throw new Error(msg);
}

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object';
}

function isString (obj) {
  return typeof obj === 'string' || obj instanceof String;
}

function isBlobInstance (obj) {
  return obj instanceof Blob;
}

angular
  .module('fileSaver', [])
  .factory('SaveAs', SaveAs);

  function SaveAs() {

    function save(blob, filename) {
      try {
        saveAs(blob, filename);
      } catch(err) {
        handleErrors(err.message);
      }
    }

    return {

      /**
      * download - Immediately starts saving a file, returns undefined.
      *
      * @param  {array|Blob} data Represented as an array or a Blob object
      * @param  {string} filename
      * @param  {object} options Set of Blob constructor options.
      * Optional parameter, if Blob object is passed as first argument
      * @return {undefined}
      */

      download: function (data, filename, options) {
        if (!isArray(data) || !isBlobInstance(data)) {
          handleErrors('Data argument should be represented as an array or Blob instance');
        }

        if (!isString(filename)) {
          handleErrors('Filename argument should be a string');
        }

        if (!isObject(options)) {
          handleErrors('Options argument should be an object');
        }

        if (isBlobInstance(data)) {
          return save(data, filename);
        }

        var blob = new Blob(data, options);
        return save(blob, filename);
      }
    };
  }

},{}]},{},[1])(1)
});