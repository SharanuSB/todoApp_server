import { sendMail } from "../middelwares/sendMail.js"
import { sendToken } from "../middelwares/sendToken.js"
import { User } from "../models/User.js"

const usersController = {}

usersController.register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // const { avatar } = req.files
        let user = await User.findOne({ email })
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User aleready exists" })
        }
        const otp = Math.floor(Math.random() * 1000000)

        user = await User.create(
            {
                name,
                email,
                password,
                avatar: {
                    public_id: "",
                    url: ""
                },
                otp,
                otp_expiry: new Date(Date.now() + 5 * 60 * 1000)
            })
        await sendMail(email, "Verify Your Account", `Your Otp is ${otp}`)

        sendToken(res, user, 201, "Otp sent to your email , please verify your account")

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.verify = async (req, res) => {
    try {
        const otp = Number(req.body.otp)
        const user = await User.findById(req.user._id)

        if (user.otp !== otp || user.otp_expiry < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid OTP or has been expired" })
        }
        user.verified = true
        user.otp = null
        user.otp_expiry = null

        await user.save()

        sendToken(res, user, 200, "Account Verified")
    } catch (error) {

    }
}

usersController.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Emal or password" })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Emal or password" })
        }

        sendToken(res, user, 200, "login successfull")

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now())
        }).json({ success: true, message: "logged out successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.addTask = async(req, res)=>{
    try {
        const {title, description}  = req.body
        const user = await User.findById(req.user._id)
        user.tasks.push({title, description, completed:false, createdAt:new Date(Date.now())})
        await user.save()
        res.status(200).json({success:true, message:"Task created Successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.removeTask = async(req, res)=>{
    try {
        const {taskId}  = req.params
        const user = await User.findById(req.user._id)
        user.tasks = user.tasks.filter(task=>task._id.toString()!==taskId.toString())
        await user.save()
        res.status(200).json({success:true, message:"Task Removed Successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.updateTask = async(req, res)=>{
    try {
        const {taskId}  = req.params
        const user = await User.findById(req.user._id)
        user.task = user.tasks.find(
            (task)=>task._id.toString()===taskId.toString()
        )
        user.task.completed = !user.task.completed
        await user.save()
        res.status(200).json({success:true, message:"Task Updated Successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

usersController.getMyProfile = async (req, res) => {
    try {
       const user = await User.findById(req.user._id)
       sendToken(
        res, user, 201, `WelcomeBack ${user.name}`
       )
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export default usersController