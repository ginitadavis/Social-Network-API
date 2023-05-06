const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => new Date(timestamp).toISOString()
  }
});

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => new Date(timestamp).toISOString()
  },
  username: {
    type: String,
    required: true
  },
  reactions: [reactionSchema]
},
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
