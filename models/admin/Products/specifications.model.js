import {conn} from '../../../app'
import { getProductsDetails } from './get_products.models';

export const addSpecification = (id_product,data) => {
    return new Promise((resolve,rejsects)=>{
        const sql = `select * from specifications where product_id = ?`
        conn.query(sql,[id_product],(err,result,field)=>{
            if(err) rejsects(err)
            else if(!result[0]){
                const sql = `insert into specifications(product_id,object)
                values(?,?)`
                conn.query(sql,[id_product,data],(err,result,field)=>{
                    if(err) rejsects(err)
                    else if(result.affectedRows >= 1){
                        getProductsDetails(id_product)
                        .then(r=>resolve(r))
                        .catch(err=>rejsects(err))
                    }else rejsects(err)
                })
            }else rejsects({
                message: "Specification not exist."
            })
        })
    })
}

export const updateSpecification = ({id_product,id_spec},content) => {
    return new Promise((resolve,rejsects)=>{
        const sql = `update specifications set object = ? where id = ? and product_id = ?`
        conn.query(sql,[content,id_spec,id_product],(err,result,field)=>{
            if(err) rejsects(err)
            else if(result.affectedRows >= 1){
                getProductsDetails(id_product)
                        .then(r=>resolve(r))
                        .catch(err=>rejsects(err))
            }else rejsects(err)
        })
    })
}

export const deleteSpecification = (id_product,id_spec) => {
    return new Promise((resolve,rejsects)=>{
        const sql = `delete from specifications where id = ? and product_id = ?`
        conn.query(sql,[id_spec,id_product],(err,result,field)=>{
            if(err) rejsects(err)
            else if(result.affectedRows >= 1){
                resolve({
                    message : "Deleted successful."
                })
            }else rejsects(err)
        })
    })
}

export const getSpecification = (id_product) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from specifications where product_id = ?`
        conn.query(sql,[id_product],(err,result,field)=>{
            if(err) rejects(err)
            else if(result[0]){
                result[0].object = JSON.parse(result[0].object)
                resolve(result[0])
            }else rejects({
                message : 'not found.'
            })
        })
    })
}