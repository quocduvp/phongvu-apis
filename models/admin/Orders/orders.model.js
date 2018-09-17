import { conn } from "../../../app";

export const getListOrders = () => {
    return new Promise((resolve,rejects)=>{
        const sql = `select email, order_date from orders; 
        select * from orders`
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const list1 = result[0]
            const list2 = result[1]
            const list_orders = list1.map((item,id)=>{
                console.log(Date.now())
                item.orders = list2.filter(v=>console.log(new Date(item.order_date)===new Date(v.order_date)))
                return item
            })
            resolve({
                list_orders
            })
        })
    })
}