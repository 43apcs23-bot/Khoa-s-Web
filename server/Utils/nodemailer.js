import { createTransport } from "nodemailer";

export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            // strict parse: env should be 'true' or 'false'
            secure: process.env.SECURE === 'true',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        try {
            await transporter.verify();
            console.info('SMTP transport verified');
        } catch (verifyErr) {
            console.error('SMTP verify failed:', verifyErr);
            return { status: verifyErr.responseCode || 500, error: verifyErr.message || String(verifyErr) };
        }
        await transporter.sendMail({
            from: `${process.env.USER_NAME || 'FootGear H'} <${process.env.USER}>`,
            to: email,
            subject: subject,
            text: text,
            html: `<html>
            <body>
                <div class="topper" style="
                            background-color: #FE3E69;
                            width: 100%;
                            height: 100%;
                            color: white;
                            font-family: sans-serif;
                            padding: 5px;
                            border-radius: 12px;
                            text-align: center;">
                    <h1 style="padding: 5px 0px 0px 0px;">${subject}</h1>
                    <p style="padding: 0px 0px 10px 0px;">
                    Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào nút bên dưới để xác thực email của bạn. Lưu ý: liên kết này sẽ hết hạn sau 24 giờ</p>
                    <a href=${text} style="color: white; padding: 10px 10px 10px 10px; border:1px solid white; border-radius:16px; cursor: pointer; text-decoration: none;">Xác thực tài khoản</a>
                    <p style="padding: 10px 0px 0px 0px;">Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
                <hr style="border-top: 1px solid #fff; border-left: 0px, marginTop:5px">
                <div class="footer content" style="margin: 0 auto;width: fit-content;">
                    <p
                        style="margin-left: auto;margin-right: auto;color: white;font-size: small;">
                        FootGear H — cửa hàng đồ thể thao, quần áo và phụ kiện. Chúng tôi cung cấp sản phẩm chất lượng giúp bạn tự tin hơn trong mọi hoạt động.</p>
                        <p style="margin-left: auto;margin-right: auto; padding: 0px 0px 10px 0px;color: white;font-size: small;">Explore our collection of shoes, sandals, boots, sneakers, and more.</p>
                        <p><a href=${process.env.BASE_URL} style="color: white; padding: 10px 10px 10px 10px; border:1px solid white; border-radius:16px; cursor: pointer; text-decoration: none;"> Visit FootGear H</a></p>
                </div>
                <p style="padding: 10px 0px 10px 0px"> &copy; 2022 FootGear H. All rights reserved.</p>
            </div>
            </body>
            </html>`,
        });
        return { status: 200 };
    } catch (error) {
        console.error('sendEmail error:', error);
        return { status: error.responseCode || 500, error: error.message || String(error) };
    }
};

export const CheckoutEmail = async (subject, user, total, cart, products) => {
    try {
        const transporter = createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.SECURE === 'true',
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        try {
            await transporter.verify();
            console.info('SMTP transport verified');
        } catch (verifyErr) {
            console.error('SMTP verify failed:', verifyErr);
            return { status: verifyErr.responseCode || 500, error: verifyErr.message || String(verifyErr) };
        }
        await transporter.sendMail({
            from: `${process.env.USER_NAME || 'FootGear H'} <${process.env.USER}>`,
            to: user.email,
            subject: subject,
            text: "Thank you for shopping with us",
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Summary</title>
                <style>
                    .main {
                        background-color: #FE3E69;
                        width: 90%;
                        height: 100%;
                        margin: auto;
                        color: white;
                        font-family: sans-serif;
                        padding: 10px;
                        border-radius: 12px;
                        text-align: center;
                    }
                    .table {
                        width: 70%;
                        margin: auto;
                        border-collapse: collapse;
                        border: 1px solid white;
                        border-radius: 12px;
                        text-align: center;
                    }
                    .table-child {
                        border: 1px solid white; border-collapse: collapse; padding: 8px 5px
                    }
                    .table-head {
                        border: 1px solid white; border-collapse: collapse; padding: 10px
                    }
                    @media only screen and (max-width: 600px) {
                        .main {
                            width: 95%;
                            margin: auto;
                        }
                        .table {
                            width: 98%;
                            margin: auto;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="main">
                    <h1>Xác nhận đơn hàng</h1>
                    <p>                        
                        Kính gửi ${user.name}, Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi. Sử dụng mã đơn hàng ${user._id} để theo dõi đơn hàng của bạn.
                    </p>
                    <p>
                    Tổng số tiền của đơn hàng là ${total}$.
                    </p>
                    <h2>Tóm tắt đơn hàng</h2>
                    <table class="table">
                        <tr class="table-head">
                            <th class="table-child">Tên sản phẩm</th>
                            <th class="table-child">Số lượng</th>
                            <th class="table-child">Giá</th>
                            <th class="table-child">Địa chỉ</th>    
                        </tr>
                        <tr class="table-head">
                            <td class="table-child">${products.map((item) => { return `${item.title}`; })}</td>
                            <td class="table-child">${products.map((item) => {
                const quantity = cart.find((cartItem) => cartItem.cartId === item._id.toString()).quantity;
                return `${quantity}`;
            })}</td>
                            <td class="table-child">${products.map((item) => { return `${item.price}`; })}</td>
                            <td class="table-child">${user.address}</td>
                        </tr>
                    </table>
                <p style="padding: 10px 0px 0px 0px;">Thank you for shopping with us. Your order has been received and is being processed. You will receive a confirmation email once your order has shipped.</p>
                <p style="padding: 10px 0px 0px 0px;">If you did not place this order, please ignore this email.</p>
                <hr style="border-top: 1px solid #fff; border-left: 0px, marginTop:5px" />
                <div class="footer content" style="margin: 0 auto;width: fit-content;">
                    <p style="margin-left: auto;margin-right: auto;color: white;font-size: small;">
                        FootGear H — cửa hàng đồ thể thao, quần áo và phụ kiện. Chúng tôi cung cấp sản phẩm chất lượng giúp bạn tự tin hơn trong mọi hoạt động.</p>
                    <p style="margin-left: auto;margin-right: auto; padding: 0px 0px 10px 0px;color: white;font-size: small;">Explore our collection of shoes, sandals, boots, sneakers, and more.</p>
                    <p><a href=${process.env.BASE_URL} style="color: white; padding: 10px 20px 10px 20px; border:1px solid white; border-radius:16px; cursor: pointer; text-decoration: none;"> Visit FootGear H</a></p>
                </div>
                <p style="padding: 10px 0px 10px 0px"> &copy; 2022 FootGear H. All rights reserved.</p>
            </div>
            </body>
            </html>`,
        });
        return { status: 200 };
    } catch (error) {
        console.error('CheckoutEmail error:', error);
        return { status: error.responseCode || 500, error: error.message || String(error) };
    }
};

