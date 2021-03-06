var fs = require('fs');
var path = require('path');
var test = require('tap-only');
var parse = require('../../lib/gradle-dep-parser').parse;
var fixturePath = path.join(__dirname, '..', 'fixtures');

test('compare full results', function (t) {
  t.plan(1);
  var gradleOutput = fs.readFileSync(
    path.join(fixturePath, 'no-wrapper', 'gradle-dependencies-output.txt'), 'utf8');
  var depTree = parse(gradleOutput, 'myPackage@1.0.0');
  var results = require(
    path.join(fixturePath, 'no-wrapper','gradle-dependencies-results.json'));

  t.same(depTree, results);
});

test('parse a `gradle dependencies` output', function (t) {
  t.plan(7);
  var gradleOutput = fs.readFileSync(path.join(
    fixturePath, 'no-wrapper', 'gradle-dependencies-output.txt'), 'utf8');
  var depTree = parse(gradleOutput, 'myPackage@1.0.0');

  t.equal(
    depTree['axis:axis']
      .dependencies['commons-discovery:commons-discovery'].version,
    '0.2', 'resolved correct version for discovery');

  t.equal(depTree['com.android.tools.build:builder'].name,
    'com.android.tools.build:builder', 'found dependency');

  if (typeof depTree['failed:failed'] === 'undefined') {
    t.pass('failed dependency ignored');
  } else {
    t.fail('failed dependency is included in result');
  }

  t.equal(
    depTree['com.android.tools.build:builder']
      .dependencies['com.android.tools:sdklib']
      .dependencies['com.android.tools:repository']
      .dependencies['com.android.tools:common']
      .dependencies['com.android.tools:annotations'].version,
    '25.3.0', 'resolved ommitted dependency version (1)');

  t.equal(
    depTree['com.android.tools.build:builder']
      .dependencies['com.android.tools:sdklib']
      .dependencies['com.android.tools:repository']
      .dependencies['com.android.tools:common']
      .dependencies['com.android.tools:annotations'].name,
    'com.android.tools:annotations', 'resolved ommitted dependency name (1)');

  t.equal(
    depTree['com.android.tools.build:builder']
      .dependencies['com.android.tools.build:manifest-merger']
      .dependencies['com.android.tools:sdklib']
      .dependencies['com.android.tools:dvlib']
      .dependencies['com.android.tools:common']
      .dependencies['com.google.guava:guava'].version,
    '18.0', 'resolved ommitted dependency version (2)');

  t.equal(
    depTree['com.android.tools.build:builder']
      .dependencies['com.android.tools.build:manifest-merger']
      .dependencies['com.android.tools:sdklib']
      .dependencies['com.android.tools:dvlib']
      .dependencies['com.android.tools:common']
      .dependencies['com.google.guava:guava'].name,
    'com.google.guava:guava', 'resolved ommitted dependency name (2)');
});

test('parse a `gradle dependencies` output', function (t) {
  return t.test('handle (n) marker', function (t) {
    t.plan(1);
    var gradleOutput = fs.readFileSync(path.join(
      fixturePath, 'api-configuration', 'gradle-dependencies-output.txt'), 'utf8');
    var depTree = parse(gradleOutput);
    var results = require(
      path.join(fixturePath, 'api-configuration','gradle-dependencies-results.json'));

    t.same(depTree, results);
  });
});
