import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    /* password: {
        type: String,
        required: true,
    }, */
    date_of_birth: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true,
    },
    authProvider: {
        type: String,
        enum: ['firebase', 'email', 'google', 'direct'],
        message: '{VALUE} is not supported as an auth provider.',
        default: 'direct'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function(next) {
    if (this.date_of_birth) {
        const today = new Date();
        const birthDate = new Date(this.date_of_birth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        this.age = age;
    }
    next();
});


const User = mongoose.model('user', userSchema);
export default User;