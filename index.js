/**
 * Activate the runner by overriding `console.log` to intercept tap output.
 * Call the return value to undo the override.
 */

module.exports = function() {
  var olog = console.log;
  var pre = document.body.appendChild(document.createElement('pre'));
  style(); // Apply initial pending style.
  console.log = function(line) {
    parse(line);
    style();
    olog.apply(console, arguments);
    pre.innerHTML += line + '\n';
  }

  return function undo() {
    console.log = olog;
  }
}

/**
 * These control what colors are used for the pending/failing/passing states.
 * Ensure that these are assigned by individual value, and that the entire
 * object is not assigned at once to ensure that references are intact.
 */

var colors = module.exports.colors = {
    PENDING: '#FCD62A'
  , FAILING: '#F28E82'
  , PASSING: '#8ECA6C'
}

var failed = 0;
var passed = 0;
var finish = false;

function parse(line) {
  if (typeof line !== 'string') line = line + '';
  if (line.indexOf('ok') === 0) {
    passed += 1;
    return;
  }

  if (line.indexOf('not ok') === 0) {
    failed += 1;
    return;
  }
}

function style() {
  var s = document.body.style;
  if (failed > 0) {
    s.backgroundColor = colors.FAILING;
  } else if (passed > 0 && failed === 0) {
    s.backgroundColor = colors.PASSING;
  } else {
    s.backgroundColor = colors.PENDING;
  }
}