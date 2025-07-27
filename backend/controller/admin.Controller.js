import bcrypt from "bcryptjs"
import { errorResponse, successResponse } from "../middleware/newResponse";
import admin from "../module/admin";
import { generateAccessToken, generateRefreshToken } from "../middleware/generateToken";

export const adminRegister = async (req, res) => {
    const { adminName, adminEmail, adminPhone, adminPassword, adminProfilePic } = req.body;
    try {
        if (!adminEmail || !adminName || !adminPhone || !adminPassword) {
            return errorResponse(404, "all field are required ")
        }
        const verifyPhoneEmail = await admin.find({ $or: [{ adminPhone }, { adminEmail }] })
        if (verifyPhoneEmail.length > 0) {
            return errorResponse(404, "Phone number and Email is already exist")
        }
        const hashPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new admin({
            adminEmail,
            adminPhone,
            adminPassword: hashPassword,
            adminName,
            adminProfilePic
        })

        await newAdmin.save();
        const payload = {
            id: newAdmin._id
        }
        const token = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            SameSite: "Strict",
            maxAge: 15 * 24 * 60 * 60 * 1000
        })
        return successResponse(201, "Successfully Register", { accessToken: token })
    } catch (error) {
        return errorResponse(500, "interal server ", error)
    }
}

export const adminLogin = async (req, res) => {
    const { idenity, adminPassword } = req.body;
    try {
        if (!idenity || !adminPassword) {
            return errorResponse(400, "All field are required")
        }
        const verifyIdentity = admin.find({ $or: [{ adminEmail: idenity }, { adminPhone: idenity }] })
        if (!verifyIdentity) {
            return errorResponse(404, "User don't  found ")
        }
        const matchPassword = await bcrypt.compare(adminPassword, verifyIdentity)
        if (!matchPassword) {
            return errorResponse(400, "Wrong password")
        }
        const payload = { id: verifyIdentity._id }
        const token = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            SameSite: "Stirct",
            maxAge: 15 * 24 * 60 * 60 * 1000
        })
        return successResponse(200, "User login Successfully", { accessToken: token })
    } catch (error) {
        return errorResponse(500, "server error")
    }
}

export const adminUpdate = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return errorResponse(404, "User id don't found")
        }
        const verifyUser = await admin.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        if (!verifyUser) {
            return errorResponse(404, "User not found")
        }
        return successResponse(200, "User Update successfully")
    } catch (error) {
        return error(500, "Server Error", error)
    }
}

export const adminDelete = async (req, res) => {
    const { id } = req.body
    try {
        if (!id) {
            return errorResponse(404, "User id don't found")
        }
        const verifyUser = await admin.findByIdAndUpdate({ _id: id })
        if (!verifyUser) {
            return errorResponse(400, "User not delete")
        }
        return successResponse(200, "User Delete Successfully")
    } catch (error) {
        return errorResponse(500, "Server error", error)
    }
}