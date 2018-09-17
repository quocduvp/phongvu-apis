import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../../config/verifyToken.config';

const route = Router()
const formdata = multer().fields([])

route.post("/checkout",[formdata,verifyToken],(req,res)=>{
    
})

export default route