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
    profileImage: {
        type: String,
        default: ''
    },
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
        this.age = calculateAge(this.date_of_birth);
    }
    next();
});

userSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();
    if (update.date_of_birth) {
        update.age = calculateAge(update.date_of_birth);
        this.setUpdate(update);
    }
    next();
});

function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const User = mongoose.model('user', userSchema);
export default User;