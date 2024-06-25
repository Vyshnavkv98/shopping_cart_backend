import { Request, Response } from "express";
import { RequestType } from "../controller/interfaces.ts";
import { IPaymentInterface } from "../interfaces/doctorSlot.js";

const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

// const DOMAIN = 'https://medss.vercel.app/'
const DOMAIN = 'http://localhost:5173/'
const paymentService = async ( req, res,paymentData) => {
  try {
    console.log(doctorData,'from payment');

    const customer=await stripe.charges.create({
      metadata:{
        regFee:doctorData.RegisterFee
      }
    })
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: paymentData?.amount,
            product_data: {
              name:'Charge for products',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}payment-success`,
      cancel_url: `${DOMAIN}payment-failed`,
    });

   return session.url
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};


export default paymentService