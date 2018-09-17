import mysql from 'mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
    stripe,
    conn
} from "../../app";
import {
    encryptedString,
    decryptedString
} from '../../config/encrypt.config';
import {
    secret_customer
} from '../../config/verifyToken.config';
import { stripe_publish_key } from '../../config/key.config';

export const createCustomer = ({
    fullname,
    email,
    phone_number,
    password
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select email from customers where email=?`
        conn.query(sql, [email], (err, result, field) => {
            if (err) rejects(err)
            else if (!result[0]) {
                const sql = `insert into customers(fullname,email,phone_number,password,verified) values(?,?,?,?,${1})`
                bcrypt.hash(password, 10, (err, hassPass) => {
                    if (err) rejects(err)
                    else if (hassPass) {
                        conn.query(sql, [fullname, email, phone_number, hassPass], (err, result, field) => {
                            if (err) rejects(err)
                            else if (result.affectedRows >= 1) {
                                resolve({
                                    message: "Register successful.",
                                    verify_key: encryptedString(email)
                                })
                            } else rejects(err)
                        })
                    } else rejects(err)
                })
            } else rejects("Email is exist.")
        })
    })
}

export const customerLogin = ({
    email,
    password
}) => {
    return new Promise((resolve, rejects) => {
        isVerified(email).then(({
            email,
            stripe_id,
            phone_number,
            verified
        }) => {
            if (verified) {
                const sql = `select email,password from customers where email=?`
                conn.query(sql, [email], (err, result, field) => {
                    if (err) rejects(err)
                    else if (result[0]) {
                        if (bcrypt.compareSync(password, result[0].password)) {
                            jwt.sign({
                                auth: {
                                    email,
                                    stripe_id,
                                    phone_number
                                }
                            }, secret_customer, {
                                expiresIn: '1d'
                            }, (err, token) => {
                                if (err) rejects(err)
                                else if (token) resolve({
                                    token: token,
                                    stripe_key: stripe_publish_key,
                                    expire: 86400
                                })
                                else rejects(err)
                            })
                        } else {
                            rejects("Authenticated fails..")
                        }
                    } else rejects(err)
                })
            } else {
                resolve({
                    message: "Please, verify account.",
                    verify_key: encryptedString(email)
                })
            }
        }).catch(err => rejects(err))
    })
}

export const customerVerifyAccount = ({
    verify_key,
    email
}) => {
    return new Promise((resolve, rejects) => {
        if (decryptedString(verify_key).toLocaleLowerCase() === email.toLowerCase()) {
            const sql = `select * from customers where email=?`
            conn.query(sql, [email], (err, result, field) => {
                if (err) rejects(err)
                else if (!Boolean(result[0].verified)) {
                    const {
                        fullname,
                        email,
                        phone_number
                    } = result[0]
                    stripe.customers.create({
                        email: email,
                        metadata: {
                            phone_number,
                            fullname
                        }
                    }).then(cus => {
                        const {
                            id
                        } = cus
                        const sql = `update customers set stripe_id=?,verified=? where email = ?`
                        conn.query(sql, [id, Boolean(true), email], (err, result, field) => {
                            if (err) rejects(err)
                            else if (result.affectedRows >= 1) {
                                resolve({
                                    message: "Accounts is verified. thanks you!"
                                })
                            } else rejects(err)
                        })
                    }).catch(err => {
                        rejects(err)
                    })
                } else resolve({
                    message: "Accounts is veryfied."
                })
            })
        } else {
            rejects("verify key invalid.")
        }
    })
}

//forgot pass
export const customerForgotAccount = ({
    email
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select email from customers where email = ?`
        conn.query(sql, [email], (err, result, field) => {
            if (err) rejects(err)
            else if (result[0]) {
                resolve({
                    reset_key: encryptedString(result[0].email)
                })
            } else rejects(err)
        })
    })
}

//reset password
export const customerResetPassword = ({
    reset_key,
    password
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select email from customers where email = ?`
        conn.query(sql, [decryptedString(reset_key)], (err, result, field) => {
            if (err) rejects(err)
            else if (result[0]) {
                bcrypt.hash(password, 10, (err, hassPass) => {
                    if (err) rejects(err)
                    else if (hassPass) {
                        const sql = `update customers set password = ? where email = ?`
                        conn.query(sql, [hassPass, decryptedString(reset_key)], (err, result, field) => {
                            if (err) rejects(err)
                            else if (result.affectedRows >= 1) {
                                resolve({
                                    message: "Reset password successful."
                                })
                            } else rejects(err)
                        })
                    } else rejects(err)
                })
            } else rejects(err)
        })
    })
}

//update password
export const customersUpdatePassword = ({
    email,
    password
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `update customers set password = ? where email =?`
        bcrypt.hash(password, 10, (err, hashPass) => {
            if (err) rejects(err)
            else if (hashPass) {
                conn.query(sql, [hashPass, email], (err, result, field) => {
                    if (err) rejects(err)
                    else if (result.affectedRows >= 1) {
                        resolve({
                            message: "Update password successful."
                        })
                    } else rejects(err)
                })
            } else rejects(err)
        })
    })
}

//update profile
export const customerUpdateProfile = ({
    stripe_id,
    email
}, {
    phone_number,
    fullname
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `update customers set phone_number=?,fullname=? where email = ?`
        conn.query(sql, [phone_number, fullname, email], (err, result, field) => {
            if (err) rejects(err)
            else if (result.affectedRows >= 1) {
               isCheckStripe({email,stripe_id},{fullname,phone_number})
               .then(r=>{
                    customerProfile({email}).then(r=>resolve(r))
                    .catch(err=>rejects(err))
               }).catch(err=>rejects(err))
            } else rejects(err)
        })
    })
}

//Get profile
export const customerProfile = ({
    email
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select email,fullname,phone_number,update_at,create_at from customers where email=?`
        conn.query(sql, [email], (err, result, field) => {
            if (err) rejects(err)
            else if (result[0]) {
                resolve(result[0])
            } else rejects(err)
        })
    })
}


//check account verify or unverify
export const isVerified = (email) => {
    return new Promise((resolve, rejects) => {
        const sql = `select email,stripe_id,phone_number,verified from customers where email = ?`
        conn.query(sql, [email], (err, result, field) => {
            if (err) rejects(err)
            else if (result[0]) resolve(result[0])
            else rejects(err)
        })
    })
}

//get history payment
export const getHistoryPayment = ({stripe_id}) => {
    return new Promise((resolve,rejects)=>{
        stripe.charges.retrieve(stripe_id).then(r=>{
            resolve(r)
        }).catch(err=>rejects(err));
    })
}

//check stripe id
export const isCheckStripe = ({
    email,
    stripe_id
}, {
    phone_number,
    fullname
}) => {
    return new Promise((resolve, rejects) => {
        stripe.customers.update(stripe_id, {
            metadata: {
                phone_number,
                fullname
            }
        }).then(r => {
            resolve(r.id)
        }).catch(err => {
            stripe.customers.create({
                email: email,
                metadata: {
                    fullname,
                    phone_number
                }
            }).then(r => resolve(r.id)).catch(err => rejects(err))
        })
    })
}

//update stripe to db
export const updateAndRetriveStripeID = (email) => {
    return new Promise((resolve,rejects)=>{
        stripe.customers.create({
            email
        }).then(cus=>{
            const sql = `update customers set stripe_id = ? where email= ?`
            conn.query(sql,[cus.id,email],(err,result,field)=>{
                if(err)rejects(err)
                else if(result.affectedRows >= 1){
                    resolve(cus.id)
                }else rejects(err)
            })
        }).catch(err=>{
            rejects({
                message : "Create customer stripe fails"
            })
        })
    })
}

