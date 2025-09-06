const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type:String,
        lowercase: true,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    location:{
        type: String,
        default: ""
    },

    profilePic: {
        type: String,
        default: ""
    },
    cart: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    purchaseHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    myProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }

    ]
},
{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);


