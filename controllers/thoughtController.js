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
        .then((thought) => {
            if(!thought){
                return res.status(404).json({ message: 'No thought with that ID'});
            }

            User.updateOne(
                {username: thought.username},
                {$pull: {thoughts: req.params.thoughtId}},
            )
            .then(() => {
                res.json({message: "Thought successfully removed"});
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ message: "Server error"});
            });
        })
        .catch((err) => res.status(500).json(err))
        // !thought? res.status(404).json({ message: 'No thought with that ID'})
        // : User.deleteMany({ _id: {$in: thought.users}}))
        // .then(() => res.json({ message: 'Thought deleted!'}))
        // .catch((err) => res.status(500).json(err));
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

    //Add a reaction to a thought
    // /api/thoughts/:thoughtId/reactions
    //reactionBody and username
    async addReaction(req, res){
        try{
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId}, 
                {$addToSet: {reactions: req.body}}, 
                {new: true}
            ).populate('reactions');
    
            if (!thought){
                return res.status(404).json({message: 'Thought not found!'});
            }
            res.json(thought);

        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Server error'});
        }  
    },

    //Delete reaction from a thought
    // /api/thoughts/:thoughtId/reactions/:_id
    async deleteReaction(req, res){
        try{
            const thought = await Thought.findOneAndUpdate(
                {_id:req.params.thoughtId},
                {$pull: {reactions: {_id: req.params.reactionId}}},
                {new: true}
            )
            res.json(thought);

        } catch(err){
            res.status(500).json(err);
        }
    }
};