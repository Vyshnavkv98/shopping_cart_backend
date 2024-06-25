import stripe from "../../config/stripe.js";

const DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173/';

export const payment = async (req, res) => {
    try {
        const { cartItems, totalAmount } = req.body;
        const email = req?.user?.email;

        // Create a customer
        const customer = await stripe.customers.create({
            email: email,
            metadata: {
                totalAmount: totalAmount
            }
        });

        // Create a line items array from cartItems
        const line_items = cartItems.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product?.productId?.productName,
                    description: product?.productId?.description,
                    images: [product?.productId?.productImage], // Ensure this is a valid URL
                },
                unit_amount: product.productId?.sellingPrice * 100, // Stripe uses the smallest currency unit (cents)
            },
            quantity: product.quantity,
        }));

        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            billing_address_collection: "auto",
            shipping_options: [
                {
                    shipping_rate: "shr_1PUu9gF3ve2G57TDsulWgrFA"
                }
            ],
            customer: customer.id,
            line_items: line_items,
            success_url: `${DOMAIN}success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}cancel`,
        });

        res.status(200).json({
            sessionId: session.id,
            success: true,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
};
