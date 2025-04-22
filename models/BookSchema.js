import mongoose from "mongoose";

const BookSchema = mongoose.Schema(
    {
        ISBN :{
            type : Number,
            required : true
        },
        name : {
            type : String,
            required : true
        },
        auther : {
            type : String,
            required : true
        },
        category : {
            type : String,
            required : true,
        },
        price : {
            type : Number
        },
        age_limit : {
            type : Number
        },
        description : {
            type : String
        },
        isConditionUsed: {
            type: Boolean,
            default: true,
            required: true,
        },
        firebaseUID: {
            type: String,
            required: true, 
          },
    }
)

const bookSchema = mongoose.model("BookSchema",BookSchema);
export default bookSchema;