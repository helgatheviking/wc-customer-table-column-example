/**
 * Build scripts.
 */

 module.exports = function(grunt) {

	// load most all grunt tasks
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Remove the build directory files
		clean: {
			main: ['build/**']
		},

		// Copy the plugin into the build directory
		copy: {
			main: {
				src: [
					'**',
					'!node_modules/**',
					'!readme.md/**',
					'!composer.json',
                    '!composer.lock',
					'!build/**',
                    '!vendor/**',
					'!license.txt',
					'!js\dist\index.deps.json',
					'!js/dist/index.asset.php',
					'!js/dist/index.js.map',
					'!readme.md',
					'!wp-assets/**',
					'!.git/**',
					'!Gruntfile.js',
					'!package.json',
                    '!package-lock.json',
          			'!gitcreds.json',
          			'!.gitcreds',
          			'!.transifexrc',
					'!.gitignore',
					'!.gitmodules',
					'!**/*.sublime-workspace',
					'!**/*.sublime-project',
					'!.wordpress-org/**',
					'!.github/**',
					'!webpack.config.js',
					'!.eslintrc.json',
					'!.distignore',
                    '!src/**',
					'!**/*~',
				],
				dest: 'build/'
			}
		},

        // Make a zipfile.
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: 'deploy/<%= pkg.version %>/<%= pkg.name %>.zip'
				},
				expand: true,
				cwd: 'build/',
				src: ['**/*'],
				dest: '/<%= pkg.name %>'
			}
		},

		// # Internationalization 

		// Add text domain
		addtextdomain: {
			textdomain: '<%= pkg.name %>',
			target: {
				files: {
					src: ['*.php', '**/*.php', '!node_modules/**', '!build/**']
				}
			}
		},

		// Generate .pot file
		makepot: {
			target: {
				options: {
					domainPath: '/languages', // Where to save the POT file.
					exclude: ['build'], // List of files or directories to ignore.
					mainFile: '<%= pkg.name %>.php', // Main project file.
					potFilename: '<%= pkg.name %>.pot', // Name of the POT file.
					type: 'wp-plugin' // Type of project (wp-plugin or wp-theme).
				}
			}
		},

		// bump version numbers
		replace: {
			Version: {
				src: [
					'readme.txt',
					'readme.md',
					'<%= pkg.name %>.php'
				],
				overwrite: true,
				replacements: [
					{
						from: /Stable tag:.*$/m,
						to: "Stable tag: <%= pkg.version %>"
					},
					{
						from: /Version:.*$/m,
						to: "Version:           <%= pkg.version %>"
					},
					{
						from: /public static \$version = \'.*.'/m,
						to: "public static $version = '<%= pkg.version %>'"
					},
					{
						from: /public \$version      = \'.*.'/m,
						to: "public $version      = '<%= pkg.version %>'"
					}
				]
			}
		}

	});

	// makepot and addtextdomain tasks
	grunt.loadNpmTasks('grunt-wp-i18n');

    // Make a zip file.
    grunt.registerTask( 'zip', [ 'clean', 'copy', 'compress' ] );

	// Build.
	grunt.registerTask( 'build', [ 'addtextdomain', 'replace', 'makepot' ] );

    // Release task(s).
	grunt.registerTask( 'release', [ 'build', 'zip', 'clean' ] );

};
