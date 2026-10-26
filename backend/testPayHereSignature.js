import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const merchantId =
    process.env.PAYHERE_MERCHANT_ID;

const merchantSecret =
    process.env.PAYHERE_MERCHANT_SECRET;

const orderId =
    "UNI1791112413554";

const amount =
    "750.00";

const currency =
    "LKR";

const statusCode =
    "2";


const hashedSecret =
    crypto
        .createHash("md5")
        .update(merchantSecret)
        .digest("hex")
        .toUpperCase();


const md5sig =
    crypto
        .createHash("md5")
        .update(
            merchantId +
            orderId +
            amount +
            currency +
            statusCode +
            hashedSecret
        )
        .digest("hex")
        .toUpperCase();


console.log(
    "Merchant ID:",
    merchantId
);

console.log(
    "MD5 Signature:",
    md5sig
);