import {configDotenv} from 'dotenv'
import { Stripe } from "stripe";

configDotenv()

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;