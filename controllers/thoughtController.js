const { Thought, User} = require('../models');

module.exports = {
    //Get all thoughts
    getThoughts(req, res) {
        Thought.find()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => res.status(500).json(err));
    },

    //Get a thought
    getSingleThought(req, res){
        Thought.findOne({ _id: req.params.thoughtId})
        .select('-__v')
        .then((thought) =>
        !thought
        ? res.status(404).json({ mesage: 'No thought with that ID'})
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    //TODO: Need to check if this is correct, how do I assign this thought
    //to a user?
    //Create a thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            User.findOneAndUpdate({_id: req.body.userId}, {$push: {thoughts: thought._id}}, {new: true})
            .then((user) => {
                res.json(user)
            })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    //Delete a thought
    deleteThought(req,res){
        Thought.findOneAndDelete({ _id: req.params.thoughtId})
        .then((thought) =>
        !thought? res.status(404).json({ message: 'No thought with that ID'})
        : User.deleteMany({ _id: {$in: thought.users}}))
        .then(() => res.json({ message: 'Thought and user deleted!'}))
        .catch((err) => res.status(500).json(err));
    },

    //Update a thought
    updateThought(req, res){
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({message: 'No thought with this ID'})
        :res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
};