const mongoose  =require('mongoose');


const userSchema = mongoose.Schema({


    name:{

        required:true,
        type:String
    },
    number:{

        required:true,
        type:Number,
        unique:true
    }
    ,password:{

        required:true,
        type:String
    },
    confirmPassword:{

        required:true,
        type:String,
        
        
    },
    role:{
        required:true,
        type:String,
        default:"user"

    }
})

const userModel  =mongoose.model("user",userSchema);


module.exports = userModel;