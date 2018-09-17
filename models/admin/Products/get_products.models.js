import { conn } from "../../../app";

export const getAllProducts = () => {
    return new Promise((resolve,rejects)=>{
        const sql = 'select * from products;select id,brands_name,brands_logo from brands;select * from images_product;select a.id,a.product_id, category_name, sub_category_name from tags a,categories b, sub_categories c where b.id = c.category_id and c.id = a.sub_categories_id;select * from specifications'
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const products = result[0]
            const brands = result[1]
            const images = result[2]
            const tags = result[3]
            const specification = result[4]
            const arrProducts = products.map((v,id)=>{
                v.brands = brands.find(b=>b.id === v.brand_id )
                v.images = images.filter(i=>i.product_id === v.id)
                v.tags = tags.filter(t=>t.product_id === v.id)
                v.specification = specification.find(t=>t.product_id === v.id) ? {
                    id : specification.find(t=>t.product_id === v.id).id,
                    product_id : specification.find(t=>t.product_id === v.id).product_id,
                    content : JSON.parse(specification.find(t=>t.product_id === v.id).object),
                } : null
                return v
            })
            resolve(arrProducts)
        })
    })
}

export const getPanigateProducts = (page,page_size) => {
    return new Promise((resolve,rejects)=>{
        const sql = 'select * from products;select id,brands_name,brands_logo from brands;select * from images_product;select a.id,a.product_id, category_name, sub_category_name from tags a,categories b, sub_categories c where b.id = c.category_id and c.id = a.sub_categories_id;select * from specifications'
        conn.query(sql,(err,result,field)=>{
            if(err) rejects(err)
            const products = result[0]
            const brands = result[1]
            const images = result[2]
            const tags = result[3]
            const specification = result[4]
            const arrProducts = products.map((v,id)=>{
                v.brands = brands.find(b=>b.id === v.brand_id )
                v.images = images.filter(i=>i.product_id === v.id)
                v.tags = tags.filter(t=>t.product_id === v.id)
                v.specification = specification.find(t=>t.product_id === v.id) ? {
                    id : specification.find(t=>t.product_id === v.id).id,
                    product_id : specification.find(t=>t.product_id === v.id).product_id,
                    content : JSON.parse(specification.find(t=>t.product_id === v.id).object),
                } : null
                return v
            })
            const total = arrProducts.length >= 0 ? arrProducts.length : 0 
            const total_page = Math.ceil(total/page_size)
            const skipRows = (page - 1) * page_size
            const retriveProduct = arrProducts.slice(skipRows,page_size)
            resolve({
                products: retriveProduct,
                total,total_page,page,page_size
            })
        })
    })
}

export const getProductsDetails = (id) => {
    return new Promise((resolve,rejects)=>{
        getAllProducts().then(r=>{
            const product_details = r.find(v=>v.id ===Number(id))
            if(product_details){
                resolve(product_details)
            }else rejects("Not found!")
        }).catch(err=>rejects(err))
    })
}

//get product with categpry
export const getProductByCategories = (page,page_size,category_name) => {
    return new Promise((resolve,rejects)=>{
            getAllProducts()
            .then(r=>{
                const pro = r.map((item,id)=>{
                    const find = item.tags.filter(tag=> tag.category_name.toLowerCase() === category_name.toLowerCase() || tag.sub_category_name.toLowerCase() === category_name.toLowerCase())
                    if(find.length > 0){
                        return item
                    }
                    
                })
                return pro.filter(v=> v)
            }).then(arrProducts=>{
                const total = arrProducts.length >= 0 ? arrProducts.length : 0
                if(page>=1 && page_size >=1){       
                    const total_page = Math.ceil(total / page_size)
                    const skipRows = (page - 1) * page_size
                    const retriveProduct = arrProducts.slice(skipRows, page_size)
                resolve({
                    products: retriveProduct,
                    total,
                    total_page,
                    page,
                    page_size
                })
                }else{
                    resolve({
                        products: arrProducts,
                        total
                    })
                }
            }).catch(err=>rejects(err))
    })
}
// export const  


//process
