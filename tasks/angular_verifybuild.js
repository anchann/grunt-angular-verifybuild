/*
 * grunt-angular-verifybuild
 * https://github.com/anchann/grunt-angular-verifybuild
 *
 * Copyright (c) 2013 anchann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	/**
	 * @param filename relative to cwd
	 * @return string or undefined
	 */
	var getRevvedFilename = function(filepath) {
		var pieces   = filepath.split('/');
		var filename = pieces.pop();
		var path     = pieces.join('/');

		var filenameGlobPattern = path + '/*' + filename;
		var revvedRegex = new RegExp('^' + path + '/[0-9a-fA-F]+\\.' + filename + '$');

		var revved = grunt.util._.filter(grunt.file.expand(filenameGlobPattern), function(match) {
			return revvedRegex.test(match);
		});

		if (revved.length === 0) { return undefined; }
		if (revved.length  >  1) { grunt.fail.warn('Multiple revved files found for ' + filepath); }

		return revved[0];
	};


	grunt.registerTask('verifybuild', 'Verify integrity of build artifacts for a yeoman angular project', function() {
		var defaultOptions = {
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
			},
			dist: (grunt.config('yeoman') || {dist: ''}).dist
		};

		var options = this.options(defaultOptions);

		grunt.util._.each(options.exist, function(filename) {
			var fullFilename = options.dist + '/' + filename;

			if (!grunt.file.exists(fullFilename)) {
				grunt.log.error('Expected file does not exist: ' + fullFilename);
			}
			else {
				grunt.log.ok('exists:    ' + fullFilename);
			}
		});

		grunt.util._.each(options.revved, function(filename) {
			var revvedFilename = getRevvedFilename(options.dist + '/' + filename);

			if (revvedFilename === undefined) {
				grunt.log.error('Expected revved file does not exist: ' + filename);
			}
			else {
				grunt.log.ok('revved:    ' + filename + '      -->      ' + revvedFilename);
			}
		});

		grunt.util._.each(options.revvedRefs, function(refs, filename) {
			var revvedFilename = getRevvedFilename(options.dist + '/' + filename);

			if (revvedFilename === undefined) {
				// allow both revved and normal filenames
				revvedFilename = options.dist + '/' + filename;
				if (!grunt.file.exists(revvedFilename)) {
					grunt.log.error('Expected file does not exist (either revved or plain): ' + filename);
					return;
				}
			}

			var content = grunt.file.read(revvedFilename);
			grunt.util._.each(refs, function(ref) {
				var revvedRefPath = getRevvedFilename(options.dist + '/' + ref);
				if (revvedRefPath === undefined) {
					grunt.log.error('revvedRef: no revved version of ' + ref + ' found.');
					return;
				}

				var revvedRefFilename = revvedRefPath.split('/').pop();
				if (new RegExp(revvedRefFilename.replace('.', '\\.')).test(content)) {
					grunt.log.ok('revvedRef: ' + revvedFilename + '    -->     ' + revvedRefFilename);
				}
				else {
					grunt.log.error('revvedRef: ' + revvedFilename + '     does not contain reference to     ' + revvedRefFilename);
				}
			});
		});

		return this.errorCount === 0;
	});

};
