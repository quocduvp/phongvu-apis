import {
    getCarts
} from "./shopping_carts.model";
import { conn, stripe } from "../../app";

export const submitPayment = (obj) => {
    return new Promise((resolve,rejects)=>{
        const { email,address,tok_card } = obj
        getCarts({email})
        .then(carts=>{
            const { total_price } = carts
            //check gio hang khong duoc rong
            if(carts.carts.length > 0){
                const sql = `insert into orders(email,address,total_price) values(?,?,?)`
                conn.query(sql,[email,address,total_price],(err,result,field)=>{
                    if(err) rejects(err)
                    else if(result.affectedRows >= 1){
                        const order_id = result.insertId
                        const items = carts.carts.map(async item=>{
                            const sql = `insert into order_items(order_id,product_id,qty,amount) values(?,?,?,?)`
                            ///ad item to order_items table
                            await conn.query(sql,[order_id,item.product_id,item.qty,item.amount],(err,result,field)=>{
                                if(err) rejects(err)
                            })
                            return item
                        })
                        //tien hanh thanh toan
                        stripe.charges.create({
                            amount: Number(carts.total_price*100),
                            currency: "usd",
                            source: tok_card,
                            description: `${email} has successfully paid the order with id of ${order_id} total amount of $${carts.total_price}, receiving address ${address}`,
                            metadata : {
                                order_id : order_id
                            }
                        }).then(success=>{
                            const sql = `delete from shopping_carts where email = ?`
                            conn.query(sql,[email],(err,result,field)=>{
                                if(err) rejects(err)
                                resolve(success)
                            })
                        }).catch(err=>{
                            rejects(err)
                        })
                    }else rejects({
                        message : "Order fails."
                    })
                })
            }else rejects({
                message : "Shopping carts null."
            })
        })
        .catch(err=>rejects(err))
    })
}

export const paypalCheckout = (obj) => {
    return new Promise((resolve,rejects)=>{
        
    })
}