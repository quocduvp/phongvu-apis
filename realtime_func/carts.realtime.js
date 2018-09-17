import jwt from 'jsonwebtoken'
import { secret_customer } from '../config/verifyToken.config';
import { addToCart, getCarts, removeCarts } from '../models/customers/shopping_carts.model';
import { stripe } from '../app';
import { submitPayment } from '../models/customers/payments.model';

export const getCartRealtime = ({token}) => {
    return new Promise((resolve,rejects)=>{
        jwt.verify(token,secret_customer,(err,authData)=>{
            if(err) rejects(err)
            else if(authData){
                const { email } = authData.auth
                getCarts({email})
                .then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects({
                message : "Unauthenticated"
            })
        })
    })
}

export const addToCartRealtime = ({product_id,qty,token}) => {
    return new Promise((resolve,rejects)=>{
        jwt.verify(token,secret_customer,(err,authData)=>{
            if(err) rejects(err)
            else if(authData){
                const { email } = authData.auth
                addToCart({email,qty,product_id})
                .then(r=>resolve(r))
                .catch(err=>rejects({
                    message : "Added fails."
                }))
            }else rejects({
                message : "Unauthenticated"
            })
        })
    })
}

export const removeItems = ({cart_id, token}) => {
    return new Promise((resolve,rejects)=>{
        jwt.verify(token,secret_customer,(err,authData)=>{
            if(err) rejects(err)
            else if(authData){
                const { email } = authData.auth
                removeCarts({email,cart_id})
                .then(r=>resolve(r))
                .catch(err=>rejects({
                    message : "Remove item fails."
                }))
            }else rejects({
                message : "Unauthenticated"
            })
        })    
    })
}

//checkout cart

export const checkOutCart = ({card_info,token}) => {
    return new Promise((resolve,rejects)=>{
        const {number,cvc,exp_month,exp_year} = card_info
        jwt.verify(token,secret_customer,(err,authData)=>{
            if(err) rejects(err)
            else if(authData){
                stripe.tokens.create({
                    card : {
                        number,
                        cvc,
                        exp_month,
                        exp_year
                    }
                }).then(r=>{
                    resolve(r)
                }).catch(err=>rejects({
                    message : "Card info is invalid."
                }))
            }else rejects({
                message : "Unauthenticated"
            })
        })
    })
}


//submit payments
export const submitPaymentRealtime = ({address,tok_card, token}) => {
    return new Promise((resolve,rejects)=>{
        jwt.verify(token,secret_customer,(err,authData)=>{
            if(err) rejects(err)
            else if(authData){
                const { email } = authData.auth
                submitPayment({address,tok_card,email})
                .then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects({
                message : "Unauthenticated"
            })
        })    
    })
}