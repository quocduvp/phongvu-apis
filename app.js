import express from 'express'
import fs from 'fs'
import https from 'https'
import http from 'http'
import bodyParser from 'body-parser'
import flash from 'express-flash'
import session from 'express-session'
import cors from 'cors'
import logger from 'morgan'
import stripePackage from 'stripe';
import {createConnection} from 'mysql'
import { valueDB } from './config/db.config';
import { stripe_key } from './config/key.config';
//socket
import socketIO from 'socket.io'
//route auth
import adminAuth from './controllers/admin/auth_admin.controller'
import adminManageAccount from './controllers/admin/manage_accounts'
import authController from './controllers/customers/auth.controller'
import specificationsController from './controllers/admin/Products/specifications.controller'
import image_productsController from './controllers/admin/Products/image_products.controller'
//route menu /category
import menuController from './controllers/admin/Menu/menu.controller'
import categoriesController from './controllers/admin/Menu/categories.controller'
import subCategoriesController from './controllers/admin/Menu/sub_categories.controller'
import brandsController from './controllers/admin/Brands/brands.controller'
import tagsController from './controllers/admin/Products/tags_products.controller'
import promotionController from './controllers/admin/Promotions/promotions.controller'
import productController from './controllers/admin/Products/products.controller'
import productClientController from './controllers/public/products_client.controller'
import { addToCartRealtime, getCartRealtime, removeItems, checkOutCart, submitPaymentRealtime } from './realtime_func/carts.realtime';
//paypal
// import paypalController from './controllers/customers/paypal_checkout.controller'
//express
const app = express()
///option https
// const options = {
//     key: fs.readFileSync('./ssl/key.pem'),
//     cert: fs.readFileSync('./ssl/cert.pem'),
//     passphrase: 'Quocdu@123'
// };
// const server = https.createServer(options,app)
const server = http.Server(app)
//config socket
const io = socketIO(server)
//stripe config
export const stripe = stripePackage(stripe_key); 
//connect dbs
let conn = createConnection(valueDB)
conn.connect((err,ok)=>{
    if(err) console.log("connect db fails.")
    else console.log("connected db.")
})
//setting
app.use(logger('dev'));
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "SESSION_SECRET"
}))
app.use(flash())
app.use(cors())
//admin
app.use('/api',adminAuth)
app.use('/api',adminManageAccount)
//payment
app.use('/api',authController)
//menu category
app.use('/api',[menuController,categoriesController,subCategoriesController])
app.use('/api',[brandsController,promotionController,specificationsController,image_productsController,tagsController])
app.use('/api',[productController,productClientController])
//payment and carts

//socket handle
let online = 0

io.on('connection', socket =>{
    online = online + 1
    console.log(online)
    //lay danh sach carts gui ve client
    socket.on("get-all-carts",token=>{
        getCartRealtime({token})
        .then(r=>{
            socket.emit("list-carts",r)
        }).catch(err => {
            socket.emit("message-err",err)
        })
    })

    //add item to cart
    socket.on("customer-add-to-carts",async obj=>{
        await addToCartRealtime(obj)
        .then(r=>{
            socket.emit("list-carts",r)
        }).catch(err=>{
            socket.emit("message-err",err)
        })
    })

    //remove item from cart
    socket.on("customer-remove-item-from-cart", obj =>{
        const { cart_id, token } = obj
        removeItems({cart_id,token}).then(r=>{
            socket.emit("list-carts",r)
        }).catch(err=>{
            socket.emit("message-err",err)
        })
    })

    //checkout
    socket.on("customer-checkout",obj=>{
        const {card_info,token} = obj
        checkOutCart({card_info,token})
        .then(r=>{
            socket.emit("card-token",{tok_card : r.id})
        })
        .catch(err=>socket.emit("message-err",err))
    })

    //submit payment
    socket.on("customer-submit-payment",obj=>{
        const {token} = obj
        submitPaymentRealtime(obj)
        .then(r=>{
            socket.emit("payment-success",r)
            getCartRealtime({token})
            .then(carts=>socket.emit("list-carts",carts))
            .catch(err=>socket.emit("message-err",err))
        })
        .catch(err=>{
            socket.emit("message-err",err)
        })
    })


    //User disconnect
    socket.on('disconnect',()=>{
        online = online - 1
        console.log(online)
        console.log(`${socket.id} disconnected.`)
    })
})


const port = process.env.PORT || 5000
//option
//http
server.listen(port,()=>{
    console.log(`Server listen port ${port}`)
})
//https
// server.listen(port,()=>{
//     console.log(`Server listen port ${port}`)
// })

export { conn }