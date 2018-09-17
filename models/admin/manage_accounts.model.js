import mysql from 'mysql'
import { conn } from '../../app';
//get all
export const getAllAccounts = (page,page_size) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select count(id) as total from accounts`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const {total} = result[0]
            const total_page = Math.ceil(total/page_size)
            const skipRows = (page - 1) * page_size
            const sql = `select id,fullname,email,avatar,job,description,create_at,update_at from accounts limit ${Number(skipRows)}, ${Number(page_size)}`
            conn.query(sql,(err,result,field)=>{
                if(err) rejects(err)
                resolve({
                    data : result,
                    total_page,total,page,page_size
                })
            })
        }) 
    })
}

//get once account
export const getAccounts = ({id}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select id,fullname,email,avatar,job,description,create_at,update_at from accounts where id = ${mysql.escape(id)}`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            else if(result[0]){
                resolve(result[0])
            }else rejects("Error")
        })
    })
}