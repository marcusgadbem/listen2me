var mongoose 	= require('mongoose'),
   	Schema 	= mongoose.Schema,
   	ObjectId 	= Schema.ObjectId;

// User Schema according to "Portable Contacts":
//    http://passportjs.org/guide/profile/
//    http://portablecontacts.net/draft-spec.html#schema
//    http://portablecontacts.net/
var UserSchema 	= new Schema({
	name: { type: String, default: '' },
  profile_image: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  authToken: { type: String, default: '' },
  emails: { type: Array },
  photos: { type: Array },
  facebook: {},
  twitter: {},
	google: {},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null }
});

/**
 * User methods
 */
UserSchema.methods = {
	normalize: function(user) {
    var picture;

    switch (user.provider) {
      case 'facebook':
        picture = ['https://graph.facebook.com/', user.facebook.id,'/picture'].join("");
        break;
      case 'twitter':
        picture = user.twitter.profile_image_url;
        break;
    }

    return {
      _id: user._id,
      provider: user.provider,
      name: user.name,
      username: user.username,
      thumbnail: picture
    };

  }
}

/*
 * Hooks
 */
// Email User
// UserSchema.pre('save', function(next){
//   notify(this.get('email'));
//   next();
// });

// Export
mongoose.model('User', UserSchema);
