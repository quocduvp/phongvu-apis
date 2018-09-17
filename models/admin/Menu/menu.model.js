import mysql from 'mysql'
import {
    conn
} from '../../../app'

export const getListMenus = () => {
    return new Promise((resolve, rejects) => {
        const sql = `select * from menus;select * from categories; select * from sub_categories`
        conn.query(sql, (err, result, field) => {
            if (err) rejects(err)
            const menu = result[0].map((v, id) => {
                const cate = result[1].filter(ct => ct.menus_id === v.id).map((v2, id) => {
                    v2.list_sub_category = result[2].filter(sc => sc.category_id === v2.id)
                    return v2
                })
                v.list_category = cate
                return v
            })
            resolve(menu)
        })
    })
}
//
export const getMenus = ({id}) => {
    return new Promise((resolve, rejects) => {
        const sql = `select * from menus where id = ?;select * from categories; select * from sub_categories`
        conn.query(sql, [id],(err, result, field) => {
            if (err) rejects(err)
            result[0][0].list_category = result[1].filter(ct => ct.menus_id === result[0][0].id).map((v2, id) => {
                v2.list_sub_category = result[2].filter(sc => sc.category_id === v2.id)
                return v2
            })
            resolve(result[0][0])
        })
    })
}
//
export const addMenus = ({
    menu_name
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `insert into menus(menu_name) values(?)`
        conn.query(sql, [menu_name], (err, result, field) => {
            if (err) rejects(err)
            else if (result.affectedRows >= 1) {
                getListMenus().then(r => resolve(r)).catch(err => rejects(err))
            } else rejects(err)
        })
    })
}

//edit menu
export const editMenus = (id, {
    menu_name
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `update menus set menu_name = ? where id = ?`
        conn.query(sql, [menu_name, id], (err, result, field) => {
            if (err) rejects(err)
            else if (result.affectedRows >= 1) {
                getListMenus().then(r => resolve(r)).catch(err => rejects(err))
            } else rejects(err)
        })
    })
}

//delete menu
export const deleteMenus = (id) => {
    return new Promise((resolve, rejects) => {
        const sql = `delete from sub_categories where exists 
        (select * from categories where categories.id = sub_categories.category_id and categories.menus_id = ?)`
        const sql2 = `delete from categories where menus_id = ?`
        const sql3 = `delete from menus where id = ?`
        conn.query(sql, [id], (err, result, field) => {
            if (err) rejects(err)
            conn.query(sql2, [id], (err, result, field) => {
                if (err) rejects(err)
                conn.query(sql3, [id], (err, result, field) => {
                    if (err) rejects(err)
                    getListMenus().then(r => resolve(r)).catch(err => rejects(err))
                })
            })
        })
    })
}