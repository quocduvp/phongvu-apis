import mysql from 'mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { conn } from '../../app';
import { secret_admin } from '../../config/verifyToken.config';

//login
export const loginAdmin = (username,password) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from admin where username=${mysql.escape(username)}`
        conn.query(sql,(err,result, field)=>{
            const hashpass = result[0].password
            if(err) rejects("Login fails")
            else if(bcrypt.compareSync(password,hashpass)){
                //create token
                jwt.sign({auth:result[0]},secret_admin,{expiresIn:'1d'},(err,token)=>{
                    if(err) rejects("Login fails.")
                    resolve({
                        token : token,
                        expire : 86400
                    })
                })
            }else{
                rejects("Login fails")
            }
        })
    })
}
//update password
export const updatePassword = (username,password) => {
    return new Promise((resolve,rejects)=>{
        bcrypt.hash(password,10,(err,hash)=>{
            if(err) rejects("Update password fails.")
            const sql = `update admin set password=${mysql.escape(hash)} where username = ${mysql.escape(username)}`
            conn.query(sql,(err,result,field)=>{
                if(err) rejects("Update password fails.")
                else if(result.affectedRows >= 1){
                    resolve("Update account successful.")
                }else rejects("Update fails.")
            })
        })
        
    })
}