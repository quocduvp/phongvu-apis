import {
    conn
} from '../../app'
import {
    getProductsDetails, getAllProducts
} from '../admin/Products/get_products.models';

export const getCarts = ({
    email
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select * from shopping_carts where email = ?`
        conn.query(sql, [email], (err, result, field) => {
            if (err) rejects(err)
            getAllProducts().then(products => {
                const items = result.map((v, index) => {
                    v.product_details = products.find(pro => pro.id === v.product_id)
                    return v
                })
                const total_price = result.reduce((total,number)=>{
                    return total + number.amount
                },0)
                resolve({
                    carts : items,
                    total_price
                })
            }).catch(err => {
                rejects(err)
            })    
        })
    })
}

export const addToCart = ({
    email,
    product_id,
    qty
}) => {
    return new Promise((resolve, rejects) => {
        getProductsDetails(product_id)
            .then(r => {
                const product = r
                return product
            }).then(product => {
                const { price,shipping_price,sales } = product
                if (qty > product.qty) {
                    rejects({
                        message: "Quantity not greater than quantity in stock."
                    })
                } else {
                    const sql = `select * from shopping_carts where product_id = ?`
                    conn.query(sql,[product_id],(err,result,field)=>{
                        if(err) rejects(err)
                        else if(result[0]){
                            const new_qty = qty
                            const cart_id = result[0].id
                            console.log(cart_id)
                            updateQty({email,new_qty,cart_id}).then(r=>{
                                resolve(r)
                            }).catch(err=>rejects(err))
                        }else{ 
                            //Neu k co item trong gio
                            const total_price = (Number(price * qty) * Number((100 - sales) / 100)) - shipping_price //tong so tien
                            const sql = `insert into shopping_carts(email,product_id,qty,amount) values(?,?,?,?)`
                            conn.query(sql, [email, product_id, qty, total_price], (err, result, field) => {
                                if (err) rejects(err)
                                else if (result.affectedRows >= 1) {
                                    getCarts({email})
                                    .then(r=>resolve(r))
                                    .catch(err=>rejects(err))
                                } else rejects({
                                    message: "Added item fails."
                                })
                            })
                        }
                    })
                }
            }).catch(err => {
                rejects({
                    message: err
                })
            })
    })
}


export const updateQty = ({
    email,
    cart_id,
    new_qty
}) => {
    return new Promise((resolve, rejects) => {
        getCarts({email})
        .then(items=>{
            const filter = items.carts.find(v=>Number(v.id) ===Number(cart_id))
            return filter
        }).then(items=>{
            const {price,qty,sales,shipping_price} = items.product_details
            //check so luong hien tai co lon hon so luong trong kho k
            const total_qty = Number(new_qty)
            if(total_qty > qty){
                rejects({
                    message: "Quantity not greater than quantity in stock."
                })
            }else{
                const total_price = (Number(price * total_qty) * Number((100 - sales) / 100)) - shipping_price
                const sql = `update shopping_carts set qty = ?, amount = ? where email = ? and id = ?`
                conn.query(sql,[total_qty, total_price,email,cart_id],(err,result,field)=>{
                    if(err) rejects(err)
                    else if(result.affectedRows >= 1){
                        getCarts({email})
                        .then(r=>resolve(r))
                        .catch(err=>rejects(err))
                    }else rejects(err)
                })
            }
        }).catch(err=>{
            rejects({
                carts : []
            })
        })
    })
}


export const removeCarts = ({email,cart_id}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from shopping_carts where email = ? and id = ?`
        conn.query(sql,[email,cart_id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getCarts({email})
                .then(r=>resolve(r)).catch(err=>rejects(err))
            }else rejects({
                message : "Not found."
            })
        })
    })
}