'use strict';

import mongoose from 'mongoose';

var GameSchema = new Schema({
  name: String,
  platform: String,
  genre: String
});
 
export default mongoose.model('Game', GameSchema);
