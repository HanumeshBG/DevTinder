const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status:{
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status`
        }
    }
},{ timestamps: true });

// indexing
connectionRequestSchema.index({fromUserId: 1, toUserId: 1})

connectionRequestSchema.pre('save', function(){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);