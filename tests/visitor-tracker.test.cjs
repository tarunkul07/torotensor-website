const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const trackerPath = path.join(__dirname, '..', 'assets', 'visitor-tracker.js');

function createElement(tagName, registry) {
  const element = {
    tagName: tagName.toUpperCase(),
    attributes: {},
    children: [],
    style: {},
    parentNode: null,
    id: '',
    async: false,
    src: '',
    type: '',
    setAttribute(name, value) {
      this.attributes[name] = String(value);
      if (name === 'id') this.id = String(value);
    },
    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      if (child.id) registry.set(child.id, child);
      child.children.forEach((nested) => {
        if (nested.id) registry.set(nested.id, nested);
      });
      return child;
    }
  };
  return element;
}

function createEnvironment(hostname) {
  const registry = new Map();
  const body = createElement('body', registry);
  const document = {
    body,
    createElement: (tagName) => createElement(tagName, registry),
    getElementById: (id) => registry.get(id) || null
  };
  return { document, window: { location: { hostname } } };
}

function runTracker(environment) {
  const source = fs.readFileSync(trackerPath, 'utf8');
  vm.runInNewContext(source, environment, { filename: trackerPath });
}

test('production visits install the configured MapMyVisitors tracker', () => {
  const environment = createEnvironment('torotensor.com');

  runTracker(environment);

  const tracker = environment.document.getElementById('mapmyvisitors');
  assert.ok(tracker);
  assert.equal(tracker.tagName, 'SCRIPT');
  assert.equal(tracker.type, 'text/javascript');
  assert.equal(tracker.async, true);
  assert.equal(
    tracker.src,
    'https://mapmyvisitors.com/map.js?d=j4bX_U1ChVDtaTwglQ__PJvYC2tY2tlrw3RCrtNvJhY&cl=ffffff&w=a'
  );
});

test('tracker stays clipped in the bottom-right corner without blocking interaction', () => {
  const environment = createEnvironment('www.torotensor.com');

  runTracker(environment);

  const container = environment.document.getElementById('visitor-tracker');
  assert.ok(container);
  assert.equal(container.attributes['aria-hidden'], 'true');
  assert.deepEqual(
    { ...container.style },
    {
      position: 'fixed',
      right: '0',
      bottom: '0',
      width: '1px',
      height: '1px',
      overflow: 'hidden',
      opacity: '0.01',
      pointerEvents: 'none',
      zIndex: '-1'
    }
  );
});

test('local previews do not pollute production visitor statistics', () => {
  const environment = createEnvironment('127.0.0.1');

  runTracker(environment);

  assert.equal(environment.document.body.children.length, 0);
});

test('tracker is installed only once when the loader runs again', () => {
  const environment = createEnvironment('torotensor.com');

  runTracker(environment);
  runTracker(environment);

  assert.equal(environment.document.body.children.length, 1);
});
