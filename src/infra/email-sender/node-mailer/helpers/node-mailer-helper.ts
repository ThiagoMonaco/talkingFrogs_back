import nodemailer from 'nodemailer'
import env from '@main/config/env'


let transport = null
export const nodeMailerHelper = {
    createTransporter: async () => {
        transport = await nodemailer.createTransport({
            host: env.smtpHost,
            port: env.smtpPort,
            secure: true,
            auth: {
                user: env.smtpAuth.user,
                pass: env.smtpAuth.pass
            }
        })
    },
    sendEmail: async (to: string, subject: string, text: string) => {
        transport.sendMail({
            from: 'Talking Frogs <' + env.smtpAuth.user + '>',
            to: to,
            subject: subject,
            text: text
        })
    }
}