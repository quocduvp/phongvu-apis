import {
    Router
} from 'express'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import {
    verifyToken,
    secret_customer
} from '../../config/verifyToken.config';
import paypal from 'paypal-rest-sdk'
const route = Router()
const formdata = multer().fields([])

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWQNNbHmG_IenFwsUUW_LUMdhwk0XvC7kAHQwfwWLL9cJXw0coiptte0S97jCwRQiXQArkLS3REMUUYB',
    'client_secret': 'EOwXVNAa1Kz7s1P_wLEUBbAbAH6VTP5oJW3_TiAXL-awYq_uhxg095anN6BLo4KLny54wcKxiEtUWpso'
});
route.post("/customer/paypal", [formdata], (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": "50.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "50.00"
            },
            "description": "Hat for the best team ever"
        }]
    }
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.json(payment.links[i].href);
                }
            }
        }
    });
})

export default route