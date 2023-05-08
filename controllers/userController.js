const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    //Get all users
    getUsers(req, res) {
        User.find()
            .then(async (users) => {
                const userObj = {
                    users
                };
                return res.json(userObj);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    //Get a single user, including user's thoughts and his friends
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({
                        user
                    })
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    //create new user POST
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },

    //Update an user PUT
    updateUser(req, res){
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            {runValidators: true, new: true}
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'No user with this ID'})
        :res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },

    //Remove an user
    //TODO:Remove a friend from a user's friend list
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'user and thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },

    async addFriend(req, res){
        try{
            const user = await User.findOneAndUpdate(
                {_id: req.params.userId}, 
                {$addToSet: {friends: req.body.friendsId}}, 
                {new: true}
            ).populate('friends');
    
            if (!user){
                return res.status(404).json({message: 'User not found!'});
            }
            res.json(user);

        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Server error'});
        }  
    },

    async removeFriend(req, res){
        try{
            const user = await User.updateOne(
                {_id:req.params.userId},
                {$pull: {friends: req.params.friendsId}},
            )
            res.json(user);

        } catch(err){
            res.status(500).json(err);
        }
        //db.users.updateOne( {_id:  ObjectId("651651651")} , { $pull: { hobbies: "Swimming" }})
    }

}