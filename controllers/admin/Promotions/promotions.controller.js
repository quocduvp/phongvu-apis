import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_admin
} from '../../../config/verifyToken.config';
import {
    getPromotions,
    getPromotionsDetails,
    editPromotion,
    addPromotion,
    deletePromotion
} from '../../../models/admin/Promotions/promotion.model';
const route = Router()
//upload config
const formdata = multer({
    storage: multer.diskStorage({
        filename: function (req, file, callback) {
            const ori = file.originalname
            callback(null, ori.substring(0, (ori.length - 4)));
        }
    }),
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico|svg)$/)) {
            return cb(new Error('Only image files are allowed! ex: jpg|jpeg|png|gif|mp4|avi'));
        }
        if (file.size >= 5242880) {
            return cb(new Error('More than size!'));
        } //5mb
        cb(null, true);
    }
}).single('image')

route.get("/promotions", (req, res) => {
    const page = req.query.page >= 1 ? req.query.page : 1
    ,page_size = req.query.page_size >= 10 ? req.query.page_size : 10
    getPromotions(page,page_size)
        .then(r => res.status(200).json(r))
        .catch(err => res.sendStatus(404))
}).get("/promotions/:id([0-9]+)", (req, res) => {
    const {
        id
    } = req.params
    getPromotionsDetails(id)
        .then(r => res.status(200).json(r))
        .catch(err => res.sendStatus(404))
}).put("/admin/promotions/:id([0-9]+)", [formdata, verifyToken], (req, res) => {
    const {
        id
    } = req.params
    const file = req.file
    const {
        title,
        content,
        date_start,
        date_finish
    } = req.body
    jwt.verify(req.token, secret_admin, (err, authData) => {
        if (err) res.sendStatus(401)
        else if (authData) {
            editPromotion(id, {
                    title,
                    file,
                    content,
                    date_start,
                    date_finish
                })
                .then(r => res.status(200).json(r))
                .catch(err => res.status(400).json(err))
        } else res.sendStatus(401)
    })
}).delete("/admin/promotions/:id([0-9]+)", [verifyToken], (req, res) => {
    const {
        id
    } = req.params
    jwt.verify(req.token, secret_admin, (err, authData) => {
        if (err) res.sendStatus(401)
        else if (authData) {
            deletePromotion(id)
            .then(r => res.status(200).json(r))
            .catch(err => res.sendStatus(400))
        } else res.sendStatus(401)
    })
}).post("/admin/promotions", [formdata, verifyToken], (req, res) => {
    const file = req.file
    const {
        title,
        content,
        date_start,
        date_finish
    } = req.body
    if (file) {
        jwt.verify(req.token, secret_admin, (err, authData) => {
            if (err) res.sendStatus(401)
            else if (authData) {
                addPromotion({
                        title,
                        file,
                        content,
                        date_start,
                        date_finish
                    })
                    .then(r => res.status(200).json(r))
                    .catch(err => res.status(400).json(err))
            } else res.sendStatus(401)
        })
    } else res.sendStatus(400)
})

export default route