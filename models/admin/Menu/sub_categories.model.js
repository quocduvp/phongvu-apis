import mysql from 'mysql'
import {
    conn
} from '../../../app'

export const getListTags = () => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from sub_categories`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            resolve(result)
        })
    })
}

export const addSubCategories = ({category_id,sub_category_name})=> {
    return new Promise((resolve,rejects)=>{
        const sql = `insert into sub_categories(category_id,sub_category_name) values(?,?)`
        conn.query(sql,[category_id,sub_category_name],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListTags().then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}

export const updateSubCategories = (id,{category_id,sub_category_name}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `update sub_categories set category_id=?,
        sub_category_name=? where id = ?`
        conn.query(sql,[category_id,sub_category_name,id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListTags().then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}

export const deleteSubCategories = (id) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from sub_categories where id = ?`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListTags().then(r=>resolve(r))
                .catch(err=> rejects(err))
            }else rejects(err)
        })
    })
}