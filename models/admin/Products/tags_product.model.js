import {
    conn
} from "../../../app";
import {
    getProductsDetails
} from "./get_products.models";

export const addTags = ({
    product_id,
    sub_categories_id
}) => {
    return new Promise((resolve, rejects) => {
        checkTagsProduct({
            product_id,
            sub_categories_id
        }).then(check => {
            const sql = `insert into tags(product_id,sub_categories_id) 
                values(?,?)`
            conn.query(sql, [product_id, sub_categories_id], (err, result, field) => {
                if (err) rejects(err)
                else if (result.affectedRows >= 1) {
                    getProductsDetails(product_id)
                        .then(r => {
                            resolve(r)
                        }).catch(err => rejects(err))
                } else rejects(err)
            })
        }).catch(err => {
            rejects(err)
        })
    })
}

export const editTags = ({
    tag_id,
    product_id,
    sub_categories_id
}) => {
    return new Promise((resolve, rejects) => {
        checkTagsProduct({
            product_id,
            sub_categories_id
        }).then(check => {
            const sql = `update tags set sub_categories_id = ? where id = ? and product_id = ?`
            conn.query(sql, [sub_categories_id, tag_id, product_id, ], (err, result, field) => {
                if (err) rejects(err)
                else if (result.affectedRows >= 1) {
                    getProductsDetails(product_id)
                        .then(r => {
                            resolve(r)
                        }).catch(err => rejects(err))
                } else rejects(err)
            })
        }).catch(err => {
            rejects(err)
        })
    })
}

export const deleteTags = ({product_id,tag_id}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from tags where id = ? and product_id = ?`
        conn.query(sql,[tag_id,product_id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getProductsDetails(product_id)
                .then(r=>{
                    resolve(r)
                }).catch(err=>{
                    rejects(err)
                })
            }else rejects({
                message : "Not found."
            })
        })
    })
}


//check
const checkTagsProduct = ({
    product_id,
    sub_categories_id
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select id from products where id = ?; select id from sub_categories where id = ?;select sub_categories_id from tags where product_id = ? and sub_categories_id = ?`
        conn.query(sql, [product_id, sub_categories_id, product_id, sub_categories_id], (err, result, field) => {
            if (err) rejects(err)
            else if (result[0][0] && result[1][0] && !result[2][0]) {
                resolve(true)
            } else rejects({
                message: 'Tag is not exist.'
            })
        })
    })
}