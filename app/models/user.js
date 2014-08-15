// User Model

var mongoose 	= require('mongoose')
   	, Schema 	= mongoose.Schema
   	, ObjectId 	= Schema.ObjectId
  	, crypto 	= require('crypto')
  	, _ 		= require('underscore');


// User Schema according to "Portable Contacts":
//	http://passportjs.org/guide/profile/
//	http://portablecontacts.net/draft-spec.html#schema
// 	http://portablecontacts.net/

var UserSchema 	= new Schema({
	name: 			{ type: String, default: '' },
    profile_image:  { type: String, default: '' },
    username:       { type: String, default: '' },
    provider:       { type: String, default: '' },
    authToken:      { type: String, default: '' },
    emails:         { type: Array },
    photos:         { type: Array },
    facebook:       {},
    twitter:        {},
  	google: 		{}
});

/**
 * Methods
 */

UserSchema.methods = {
	someMethod: function(params) { }
}

mongoose.model('User', UserSchema);
