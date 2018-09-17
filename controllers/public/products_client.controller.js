import {
    Router
} from 'express'
import { getProductsDetails, getPanigateProducts, getProductByCategories } from '../../models/admin/Products/get_products.models';
import { getSpecification } from '../../models/admin/Products/specifications.model';
const route = Router()

route.get("/products",(req,res)=>{
    const page_size  = req.query.page_size >= 1 ? req.query.page_size : 1
    const page = req.query.page >= 1 ? Number(req.query.page) : 1
    getPanigateProducts(page,page_size).then(r=>res.status(200).json(r))
    .catch(err=>res.status(404).json(err))
}).get("/products/:id([0-9+])",(req,res)=>{
    const {id} = req.params
    getProductsDetails(id).then(r=>res.status(200).json(r))
    .catch(err=>res.status(404).json(err))
}).get("/products/category",(req,res)=>{
    const { category_name,page,page_size } = req.query
    getProductByCategories(page,page_size,category_name).then(r=>res.status(200).json(r))
    .catch(err=>res.status(404).json(err))
}).get("/products/:id_product([0-9]+)/specifications",(req,res)=>{
    const { id_product } = req.params
    getSpecification(id_product)
    .then(r=>{
        res.status(200).json(r)
    }).catch(err=>{
        res.sendStatus(404)
    })
})


export default route