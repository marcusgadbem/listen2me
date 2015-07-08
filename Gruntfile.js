/* globals module */

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
               '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
               '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
               '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
               ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      vendor: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/assets/js/vendor.js.map'
        },
        files: {
          'public/assets/js/vendor.min.js': [
            'bower_modules/jquery/jquery.js',
            'bower_modules/fastclick/fastclick.js',
            'bower_modules/foundation/js/foundation/foundation.js',
            'bower_modules/foundation/js/foundation/foundation.dropdown.js',
            'src/js/vendor/swfobject.js',
            'src/js/vendor/tmpl.js',
            'src/js/vendor/lodash.compact.min.js',
            'src/js/vendor/postal.min.js'
          ]
        }
      },
      application: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/assets/js/application.js.map'
        },
        files: {
          'public/assets/js/application.min.js': [
            'src/js/app/plugins.js',
            'src/js/app/player.js',
            'src/js/app/playlist.js',
            'src/js/app/search.js',
            'src/js/app/sockets.js',
            'src/js/app/ui.js'
          ]
        }
      },
      main: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/assets/js/main.js.map'
        },
        files: {
        'public/assets/js/main.min.js': [
          'src/js/main.js'
          ]
        }
      },
      landingpage: {
        options: {
          sourceMap: true,
          sourceMapName: 'public/assets/js/home.js.map'
        },
        files: {
          'public/assets/js/home.min.js': [
            'src/js/home.js'
          ]
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          require: true,
          module: true,
          process: true,
          console: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    sass: {
      options: {
        includePaths: ['bower_modules/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'public/assets/css/main.min.css': 'src/scss/main.scss'
        }
      }
    },
    // autoprefixer: {
    //   dist: {
    //     options: {
    //       browsers: ['last 2 versions', '> 10%', 'ie 8']
    //     },
    //     files: {
    //       'public/css/main.min.css': ['public/css/main.min.css'],
    //       'public/css/site.min.css': ['public/css/site.min.css'],
    //       'public/css/admin.min.css': ['public/css/admin.min.css']
    //     }
    //   }
    // },
    copy: {
      imgs: {
        expand: true,
        cwd: 'src/img/',
        src: '**',
        dest: 'public/assets/img'
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      // sass: {
      //   files: ['src/scss/**/*.scss'],
      //   tasks: ['sass']
      // },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify']
      }
    },
    //,
    // We are moving 'compile' to a diff window than 'nodemon:dev'
    // concurrent: {
    //   std: {
    //     tasks: ['nodemon:dev'],
    //     options: {
    //       logConcurrentOutput: true
    //     }
    //   }
    // }
  });

  // Loading needed plugins for the the tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  // grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-bower-installer');

  // Register Tasks
  grunt.registerTask('copy-static', ['copy:imgs']);
  grunt.registerTask('compile', [/*'sass', */'uglify'])
};
