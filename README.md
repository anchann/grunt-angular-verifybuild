# grunt-angular-verifybuild

> Verify integrity of build artifacts for a yeoman angular project

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-angular-verifybuild --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-angular-verifybuild');
```

## The "verifybuild" task

The build process for angular+typescript (https://github.com/anchann/angularjs-typescript-e2e) based projects is
getting rather involved, partcularly because of the requirement to version all build artifacts other than
`index.html`. To make sure that the build process doesn't break down the line, we add a final verification stage
to the build process.

One can verify three things with the current implementation: existence of files, existence of revved versions
of certain files, and references from a file to a set of revved files. Verifying these conditions on certain
files will guarantee that the build ran successfully. An example of an unsuccessful build would be the partials
bundle, `templates.js`, containing the contents of `.html` partials _before_ references to assets in them were updated
with their revved versions.

Probably obvious, but a representative set of files is enough, don't list all seven hundred of your asset files in the config.

### Overview
In your project's Gruntfile, add a section named `verifybuild` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  verifybuild: {
    options: {
      hostUrl: "//cdn.domain.com",
      exist: [
        'index.html',
      ],
      revved: [
        'scripts/scripts.js',
        'scripts/templates.js',
        'styles/styles.css',
      ],
      revvedRefs: {
        'index.html': [
          'scripts/scripts.js',
          'scripts/templates.js',
          'styles/styles.css',
        ],
        'scripts/templates.js': [
          'images/nested/many/levels/deep/bullet.png',
        ],
        'styles/styles.css': [
          'images/nested/many/levels/deep/bullet.png',
        ],
      },
    }
  },
})
```

### Options

#### options.hostUrl
Type: `String`
Default value: `undefined`

If you provide `hostUrl` for the usemin task, provide one here too.


#### options.dist
Type: `String`
Default value: `grunt.config('yeoman').dist` || `''`

The directory that holds distribution artifacts.

#### options.exist
Type: `Array of String`
Default value: `['index.html']`

List of files whose existence is necessary for a successful build.

#### options.revved
Type: `Array of String`
Default value: `['scripts/scripts.js', 'scripts/templates.js', 'styles/styles.css',]`

List of files for which a revved version must be present. That is, in a successful build, if
`'scripts/scripts.js'` is listed in `options.revved`, something like `scripts/41a432de.scripts.js`
had better be present in the `dist` directory.

#### options.revvedRefs
Type: `Map<String, Array of String>`
Default value: `{'index.html' : ['scripts/scripts.js', 'scripts/templates.js', 'styles/styles.css',] }`

For each key : refs, a possibly revved file key must contain at least one textual reference to the revved
names of each file in refs. So the text of `index.html` had better contain `0132abcd.scripts.js`,
`0132abcd.templates.js`, and `0132abcd.styles.css`. Furthermore, refs that match the following properties
are expected to be prepended with hostUrl if one was specified:

* all root-relative revved assets
* non-root-relative revved assets in non-revved files

So if you have a hostUrl defined and have a leading slash in any of your refs, those will always be checked
with hostUrl prepended. Furthermore, if your filename is _not_ revved, inside it any refs that _do not_ start
with a leading slash will be expected to have the hostUrl prepended.

This behaviour is necessary to ensure that all statis assets are served statically.


## TODO

I was going to write tests, but could not figure out how to test for grunt task failure, since it's the
failure of verification that's most interesting to test for. Will dig a bit more and come back to this later.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
