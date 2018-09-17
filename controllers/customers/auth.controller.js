import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    createCustomer,
    customerLogin,
    customerVerifyAccount,
    customerForgotAccount,
    customerResetPassword,
    customersUpdatePassword,
    customerProfile,
    customerUpdateProfile
} from '../../models/customers/auth.model';
import {
    secret_customer,
    verifyToken
} from '../../config/verifyToken.config';

const route = Router()
const formdata = multer().fields([])
route.post("/customer/register", formdata, (req, res) => {
    const {
        fullname,
        email,
        phone_number,
        password,
        password2
    } = req.body
    if (password !== password2) res.sendStatus(400)
    else {
        createCustomer({
                fullname,
                email,
                phone_number,
                password
            })
            .then(r => res.status(200).json(r))
            .catch(err => res.sendStatus(400))
    }
}).post("/customer/verify", formdata, (req, res) => {
    const {
        verify_key,
        email
    } = req.body
    customerVerifyAccount({
        verify_key,
        email
    }).then(r => {
        res.status(200).json(r)
    }).catch(err => res.sendStatus(403))
}).post("/customer/login", formdata, (req, res) => {
    const {
        email,
        password
    } = req.body
    customerLogin({
            email,
            password
        }).then(r => res.status(200).json(r))
        .catch(err => res.sendStatus(403))
}).post("/customer/forgot", formdata, (req, res) => {
    const {
        email
    } = req.body
    customerForgotAccount({
            email
        }).then(r => res.status(200).json(r))
        .catch(err => res.sendStatus(404))
}).post("/customer/reset_password", formdata, (req, res) => {
    const {
        reset_key,
        password,
        password2
    } = req.body
    if (password === password2) {
        customerResetPassword({
                reset_key,
                password
            }).then(r => res.status(200).json(r))
            .catch(err => res.sendStatus(400))
    } else res.sendStatus(400)
}).put("/customer/update_password", [formdata, verifyToken], (req, res) => {
    const {
        password,
        password2
    } = req.body
    if (password === password2) {
        jwt.verify(req.token, secret_customer, (err, authData) => {
            if (err) res.sendStatus(401)
            else if (authData) {
                const {
                    email
                } = authData.auth
                customersUpdatePassword({
                        email,
                        password
                    }).then(r => res.status(200).json(r))
                    .catch(err => res.sendStatus(400))
            } else res.sendStatus(401)
        })
    } else res.sendStatus(400)
}).put("/customer/profiles", [formdata, verifyToken], (req, res) => {
    const {
        fullname,
        phone_number
    } = req.body
    jwt.verify(req.token, secret_customer, (err, authData) => {
        if (err) res.sendStatus(401)
        else if (authData) {
            const {
                email,
                stripe_id
            } = authData.auth
            customerUpdateProfile({
                    stripe_id,
                    email
                }, {
                    phone_number,
                    fullname
                })
                .then(r => res.status(200).json(r)).catch(err => res.sendStatus(400))
        } else res.sendStatus(401)
    })
}).get("/customer/profiles", verifyToken, (req, res) => {
    jwt.verify(req.token, secret_customer, (err, authData) => {
        if (err) res.sendStatus(401)
        else if (authData) {
            const {
                email
            } = authData.auth
            customerProfile({
                    email
                }).then(r => res.status(200).json(r))
                .catch(err => res.sendStatus(404))
        } else res.sendStatus(401)
    })
})

export default route