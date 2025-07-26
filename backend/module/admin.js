import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    adminName: { type: String, require: true },
    adminEmail: { type: String, require: true },
    adminPhone: { type: String, require: true },
    adminPassword: { type: String, require: true },
    companyProfilePic: { type: String}
},{
    timestamps: true
})
const admin = mongoose.model('admin', adminSchema)
export default admin