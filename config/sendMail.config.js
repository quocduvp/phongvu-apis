import nodemailer from 'nodemailer'

export const sendMail = (mainOptions) => {
    return new Promise((resolve,rejects)=>{
        let transporter =  nodemailer.createTransport({ // config mail server
            // service: 'gmail',
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'bjnb54fdlx2ulenf@ethereal.email',
                pass: 'vw8aXzGaz2aSh6UWpt'
            }
        });
        transporter.sendMail(mainOptions, function(err, info){
            if (err) rejects(err)
            else {
                resolve(info)
            }
        });
    })
}
