import mysql from 'mysql'
import {
    conn
} from '../../../app'

export const getListCategories = () => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from categories;select * from sub_categories`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const cate = result[0].map((v2, id) => {
                v2.list_sub_category = result[1].filter(sc => sc.category_id === v2.id)
                return v2
            })
            resolve({
                categories : cate
            })
        })
    })
}

export const getCategories = ({id}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `select * from categories where id=?;select * from sub_categories`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            result[0][0].list_sub_category = result[1].filter(sc => sc.category_id === result[0][0].id)
            resolve(result[0][0])
        })
    })
}

export const updateCategories = (id,{menus_id,category_name}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `update categories set menus_id = ?, category_name= ? where id = ?`
        conn.query(sql,[menus_id,category_name, id],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListCategories().then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}

export const deleteCategories = ({id}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `delete from sub_categories where category_id = ?`
        conn.query(sql,[id],(err,result,field)=>{
            if(err) rejects(err)
            const sql = `detete from categories where id = ?`
            conn.query(sql,[id],(err,result,field)=>{
                if(err) rejects(err)
                else if(result.affectedRows >= 1){
                    getListCategories().then(r=>resolve(r))
                    .catch(err=>rejects(err))
                }else rejects(err)
            })
        })    
    })
}

export const addCategories = ({menus_id,category_name}) => {
    return new Promise((resolve,rejects)=>{
        const sql = `insert into categories(menus_id,category_name) values(?,?)`
        conn.query(sql,[menus_id,category_name],(err,result,field)=>{
            if(err) rejects(err)
            else if(result.affectedRows >= 1){
                getListCategories().then(r=>resolve(r))
                .catch(err=>rejects(err))
            }else rejects(err)
        })
    })
}