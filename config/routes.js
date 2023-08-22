import express from "express"
import usersController from "../app/controllers/usersController.js"
import { isAuthenticated } from "../app/middelwares/auth.js"
const router = express.Router()

router.post("/api/users/register", usersController.register)
router.post("/api/users/verify",isAuthenticated, usersController.verify)
router.post("/api/users/login",usersController.login)
router.get("/api/users/logout",usersController.logout)
router.post("/api/users/addTask",isAuthenticated, usersController.addTask)
router.delete("/api/users/removeTask/:taskId",isAuthenticated, usersController.removeTask)
router.get("/api/users/updateTask/:taskId",isAuthenticated, usersController.updateTask)
router.get("/api/users/me", isAuthenticated, usersController.getMyProfile)

export default router

