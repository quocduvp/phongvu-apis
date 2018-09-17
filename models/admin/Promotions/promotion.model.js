import { conn } from "../../../app";
import { uploadImageToStorage } from "../../../config/cloudinary.config";

export const getPromotions = (page,page_size) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select count(id) as total from promotions`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const {total} = result[0]
            const total_page = Math.ceil(total/page_size)
            const skipRows = (page - 1) * page_size
            const sql = 'select * from promotions limit ?,?'
            conn.query(sql,[Number(skipRows),Number(page_size)],(err,result,field)=>{
                if(err) rejects(err)
                const arr = result.map((v,id)=>{
                    v.date_start = new Date(v.date_start).toLocaleDateString()
                    v.date_finish = new Date(v.date_finish).toLocaleDateString()
                    return v
                })
                resolve({
                    list: arr,
                    total_page,total,page,page_size
                })
            })
        })
    })
}

export const getPromotionsDetails = (id) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from promotions where id = ?`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result[0]){
                new Date(result[0].date_start).toLocaleDateString()
                new Date(result[0].date_finish).toLocaleDateString()
                resolve(result[0])
            }else rejects(err)
        })
    })
}

export const addPromotion = ({title,content,file,date_start,date_finish}) => {
    return new Promise((resolve,rejects)=>{
        const ds = new Date(date_start),
                df = new Date(date_finish)
        if(ds < df && df <= Date.now()){
            const sql = `insert into promotions(title,content,image,date_start,date_finish) values(?,?,?,?,?)`
            uploadImageToStorage(file,"promotions").then(url=>{
                conn.query(sql,[title,content,url,ds,df],(err,result,field)=>{
                    if(err) rejects(err)
                    else if(result.affectedRows >= 0){
                        getPromotions(1,10)
                        .then(r=>resolve(r))
                        .catch(err=>rejects(err))
                    }else rejects(err)
                })
            })
            .catch(err=>rejects(err))
        }else{
            rejects("Insert date fails.")
        }
    })
}

export const editPromotion = (id,{title,content,file,date_start,date_finish}) => {
    return new Promise((resolve,rejects)=>{
        const ds = new Date(date_start),
            df = new Date(date_finish)
        if(ds < df && df <= Date.now()){
            if(file){
                const sql = `update promotions set title=?,content=?,image=?,date_start=?,date_finish=? where id=?`
                uploadImageToStorage(file,"promotions").then(url=>{
                    conn.query(sql,[title,content,url,ds,df,id],(err,result,field)=>{
                        if(err) rejects(err)
                        else if(result.affectedRows >= 0){
                            getPromotions(1,10)
                            .then(r=>resolve(r))
                            .catch(err=>rejects(err))
                        }else rejects(err)
                    })
                })
                .catch(err=>rejects(err))
            }else{
                const sql = `update promotions set title=?,content=?,date_start=?,date_finish=? where id=?`
                conn.query(sql,[title,content,ds,df,id],(err,result,field)=>{
                    if(err) rejects(err)
                    else if(result.affectedRows >= 0){
                        getPromotions()
                        .then(r=>resolve(r))
                        .catch(err=>rejects(err))
                    }else rejects(err)
                })
            }
        }else{
            rejects("Update date fails.")
        }
    })
}

export const deletePromotion = (id) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from promotions where id = ?`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getPromotions(1,10)
                .then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}