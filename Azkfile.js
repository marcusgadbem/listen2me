/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({

  'l2m': {
    // Dependent systems
    depends: ['mongodb'],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/node:0.12"},
    // Steps to execute before running instances
    provision: [
      "npm install"
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "npm start",
    mounts: {
      '/azk/#{manifest.dir}': path("."),
      '/azk/#{manifest.dir}/bower_components': path("bower_components"),
      '/azk/#{manifest.dir}/node_modules': path("node_modules")
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "8000"
    },
    envs: {
      NODE_ENV: "dev",
      NODE_IP: "0.0.0.0",
      PORT: "8000",
      APP_NAME: 'Listen 2 me!',
      APP_URL: "http://#{system.name}.#{azk.default_domain}",
      SESSION_SECRET: 'brown sugar',
      SERVICES: {
        FACEBOOK: {
          clientID: "750620371619521",
          clientSecret: "47b7fb5ae41bb139f5839fe6fad83443",
          callbackURL: "/auth/facebook/callback"
        },
        TWITTER: {
          clientID: "vOhPoMCF2vrwpjtWHudcA",
          clientSecret: "kxHKSMN403A2ETJL1HtTWipvPa8wsKUy1PiFztsqE",
          callbackURL: "/auth/twitter/callback"
        },
        GOOGLE: {
          clientID: "432822864473-2veuhlea45646s6s0joi82di0fkal9il.apps.googleusercontent.com",
          clientSecret: "VMjB1WeaETl8r_CPkMTwYg_L",
          callbackURL: "/auth/google/callback"
        }
      }
    },
  },

  mongodb: {
    image : { docker: "azukiapp/mongodb" },
    command: 'mongod --rest --httpinterface',
    scalable: false,
    wait: {"retry": 20, "timeout": 1000},
    // Mounts folders to assigned paths
    mounts: {
      // equivalent persistent_folders
      '/data/db': persistent('mongodb-#{manifest.dir}'),
    },
    ports: {
      http: "28017:28017/tcp",
    },
    http: {
      domains: [ "#{manifest.dir}-#{system.name}.#{azk.default_domain}" ],
    },
    export_envs: {
      MONGODB_URI: "mongodb://#{net.host}:#{net.port[27017]}/#{manifest.dir}_development",
    },
  }

});



