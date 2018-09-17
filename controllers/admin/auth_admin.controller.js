import {
    Router
} from 'express'
import multer from 'multer'
import {
    loginAdmin,
    updatePassword
} from '../../models/admin/auth_admin.model';
import jwt from 'jsonwebtoken'
import {
    verifyToken, secret_admin
} from '../../config/verifyToken.config'
const upload = multer()
const route = Router()

// login admin
route.post("/admin/login", upload.fields([]), (req, res) => {
    const {
        username,
        password
    } = req.body
    loginAdmin(username, password).then(r => {
        res.status(200).json(r)
    }).catch(err => {
        res.status(403).send(err)
    })
})
//update password
route.put("/admin/update_password", [upload.fields([]), verifyToken], (req, res) => {
    const {
        password,
        password2
    } = req.body
    if (password === password2) {
        jwt.verify(req.token, secret_admin, (err, authData) => {
            const {
                username
            } = authData.auth
            if (err) res.sendStatus(401)
            else if(authData){
                updatePassword(username, password).then(r => {
                    res.status(200).send(r)
                }).catch(err => {
                    res.sendStatus(401)
                })
            }else res.sendStatus(401)
        })
    } else {
        res.sendStatus(400)
    }
})
//Delete customer


export default route