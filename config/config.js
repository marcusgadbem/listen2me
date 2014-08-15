module.exports  = {
    "development": {
        "app": "Listem 2 Me!",
        "session_secret": "l2ms3cr3t",
        "url": "http://listen2me.dev",
        "mongoUrl": "mongodb://localhost/l2m_development",
        "facebook": {
            "clientID": "750620371619521",
            "clientSecret": "47b7fb5ae41bb139f5839fe6fad83443",
            "callbackURL": "/auth/facebook/callback"
        },
        "twitter": {
            "clientID": "vOhPoMCF2vrwpjtWHudcA",
            "clientSecret": "kxHKSMN403A2ETJL1HtTWipvPa8wsKUy1PiFztsqE",
            "callbackURL": "/auth/twitter/callback"
        },
        "google": {
            "clientID": "432822864473-2veuhlea45646s6s0joi82di0fkal9il.apps.googleusercontent.com",
            "clientSecret": "VMjB1WeaETl8r_CPkMTwYg_L",
            "callbackURL": "/auth/google/callback"
        }
    },
    "test": {
        "app": "Listem 2 Me!",
        "session_secret": "l2ms3cr3t",
        "url": "http://listen2me.dev",
        "mongoUrl": "mongodb://localhost/l2m_test",
        "facebook": {
            "clientID": "APP_ID",
            "clientSecret": "APP_SECRET",
            "callbackURL": "/auth/facebook/callback"
        },
        "twitter": {
            "clientID": "CONSUMER_KEY",
            "clientSecret": "CONSUMER_SECRET",
            "callbackURL": "/auth/twitter/callback"
        },
        "google": {
            "clientID": "APP_ID-2veuhlea45646s6s0joi82di0fkal9il.apps.googleusercontent.com",
            "clientSecret": "APP_SECRET",
            "callbackURL": "/auth/google/callback"
        }
    },
    "production": {
        "app": "Listem 2 Me!",
        "session_secret": "l2ms3cr3t",
        "url": "http://listen2me.io",
        "mongoUrl": "mongodb://localhost/l2m_production",
        "facebook": {
            "clientID": "1439190106334111",
            "clientSecret": "dccb958aa431eb6ee6f2fd8d70a307d0",
            "callbackURL": "/auth/facebook/callback"
        },
        "twitter": {
            "clientID": "dZWrHZ8RigLDR3g2PgI7ynD4E",
            "clientSecret": "LPXflD798fVsZXfXDG3IenOPIMXV4TXyoVy00J8PWDOjNkugNy",
            "callbackURL": "/auth/twitter/callback"
        },
        "google": {
            "clientID": "",
            "clientSecret": "",
            "callbackURL": "/auth/google/callback"
        }
    }
}
