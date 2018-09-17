import {
    conn
} from '../../../app'
import {
    uploadImageToStorage
} from '../../../config/cloudinary.config';
import {
    getProductsDetails
} from './get_products.models';

export const uploadImageProduct = ({
    product_id
}, file) => {
    return new Promise((resolve, rejects) => {
        const sql = `insert into images_product(product_id,source) values(?,?)`
        uploadImageToStorage(file, "image_product").then(url => {
            conn.query(sql, [product_id, url], (err, result, field) => {
                if (err) rejects(err)
                else if (result.affectedRows >= 1) {
                    getProductsDetails(product_id)
                        .then(r => resolve(r))
                        .catch(err => rejects(err))
                } else rejects(err)
            })
        }).catch(err => {
            rejects({
                message: "upload image fails."
            })
        })
    })
}

export const editImageProduct = ({
    image_id,
    product_id
}, file) => {
    return new Promise((resolve, rejects) => {
        const sql = `update images_product set source=? where id=? and product_id=?`
        uploadImageToStorage(file, "image_product").then(url => {
            conn.query(sql, [url,image_id, product_id], (err, result, field) => {
                if (err) rejects(err)
                else if (result.affectedRows >= 1) {
                    getProductsDetails(product_id)
                        .then(r => resolve(r))
                        .catch(err => rejects(err))
                } else rejects(err)
            })
        }).catch(err => {
            rejects({
                message: "upload image fails."
            })
        })
    })
}

export const deleteImageProduct = ({
    image_id,
    product_id
}) => {
    return new Promise((resolve, rejects) => {
        const sql = `delete from images_product where id=? and product_id=?`
        conn.query(sql, [image_id, product_id], (err, result, field) => {
            if (err) rejects(err)
            else if (result.affectedRows >= 1) {
                console.log({
                    image_id,
                    product_id
                })
                getProductsDetails(product_id)
                        .then(r => resolve(r))
                        .catch(err => rejects(err))
            } else rejects(err)
        })
    })
}