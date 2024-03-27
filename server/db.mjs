// 1ST DRAFT DATA MODEL
import mongoose from 'mongoose';
import './config.mjs'

// Connect to the database
mongoose.connect(process.env.URI);

// User Schema
const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, {
  _id: true
});


// Class Schema
const classSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  className: {type: String, required: true},
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }]
}, {
  _id: true
});

// Note Schema
const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, required: true},
  content: {type: String, required: true},
}, {
  _id: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Class = mongoose.model('Class', classSchema);
const Note = mongoose.model('Note', noteSchema);


export { userSchema, classSchema, noteSchema };

// TODO: add remainder of setup for slugs, connection, registering models, etc. below
