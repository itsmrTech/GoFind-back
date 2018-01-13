/**
 *          .::VERIFICATION MODEL::.
 * Verification Mongoose model
 * 
 */


var verificationSchema = mongoose.Schema({
    code: String,
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    expiredAt:Date,
    expireOn:Date,
});

verificationSchema.plugin(mongooseTimestamp);




export default mongoose.model('_verification', verificationSchema);