const mongoose  =require('mongoose');


const userSchema = mongoose.Schema({


    name:{

        require:true,
        type:String
    },
    number:{

        require:true,
        type:Number,
        unique:true
    }
    ,password:{

        require:true,
        type:String
    },
    confirmPassword:{

        require:true,
        type:String,
        
        
    }
})

const userModel  =mongoose.model("user",userSchema);


module.exports = userModel;