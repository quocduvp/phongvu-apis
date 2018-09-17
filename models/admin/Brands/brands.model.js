import { conn } from "../../../app";
import { uploadImageToStorage } from "../../../config/cloudinary.config";

export const getListBrands = () => {
    return new Promise((resolve,rejects)=>{
        const sql = 'select * from brands'
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            resolve(result)
        })
    })
}

export const getBrandDetails = (id) => {
    return new Promise((resolve,rejects)=>{
        const sql = 'select * from brands where id = ?'
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result[0]){
                resolve(result[0])
            }else rejects(err)
        })
    })
}

// add brands
export const addBrands = ({brands_name,file}) =>{
    return new Promise((resolve,rejects)=>{
        const sql = 'insert into brands(brands_name,brands_logo) values(?,?)'
        uploadImageToStorage(file,'brands').then(url=>{
            conn.query(sql,[brands_name,url],(err,result,field)=>{
                if(err) rejects(err)
                else if(result.affectedRows >= 1){
                    getListBrands()
                    .then(r=>resolve(r)).catch(err=>rejects(err))
                }else rejects(err)
            })
        }).catch(err=>rejects(err))
    })
}

//update brand
export const updateBrands = (id,{brands_name,file}) => {
    return new Promise((resolve,rejects)=>{
        if(file){
            const sql = `update brands set brands_name=?,brands_logo=? where id=?`
            uploadImageToStorage(file,'brands').then(url=>{
                conn.query(sql,[brands_name,url,id],(err,result,field)=>{
                    if(err) rejects(err)
                    else if(result.affectedRows >= 1){
                        getListBrands()
                        .then(r=>resolve(r)).catch(err=>rejects(err))
                    }else rejects(err)
                })
            }).catch(err=>rejects(err))
        }else{
            const sql = `update brands set brands_name=? where id=?`
            conn.query(sql,[brands_name,id],(err,result,field)=>{
                if(err) rejects(err)
                else if(result.affectedRows >= 1){
                    getListBrands()
                    .then(r=>resolve(r)).catch(err=>rejects(err))
                }else rejects(err)
            })
        }
    })
}

//delete brand
export const deleteBrands = (id) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from brands where id = ?`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListBrands()
                .then(r=>resolve(r)).catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}