import { conn } from "../../../app";

export const addNewProduct = ({
    brand_id,
    name, price,
    qty,sales,
    shipping_price,
    description
}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `insert into products(brand_id,
            name, price,
            qty,sales,
            shipping_price,
            description) values(?,?,?,?,?,?,?)`
        conn.query(sql,[Number(brand_id),
            name, Number(price),
            Number(qty),Number(sales).toFixed(),
            Number(shipping_price),
            description],(err,result,field)=>{
                if(err) rejects(err)
                else if(result.affectedRows >= 1){
                    resolve({message: "Ok guy"})
                }else rejects(err)
            })
    })
}

//
export const editProduct = (id,{
    brand_id,
    name, price,
    qty,sales,
    shipping_price,
    description
}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `update products set brand_id=?,name=?,price=?,qty=?,sales=?,shipping_price=?,description=? where id = ?`
        console.log(sql)
        conn.query(sql,[Number(brand_id),
            name, Number(price),
            Number(qty),Number(sales),
            Number(shipping_price),
            description,id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                resolve({message: "Ok guy"})
            }else rejects(err)
        })
    })
}