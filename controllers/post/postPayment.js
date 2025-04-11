const { tryCatch } = require("../../utils/tryCatch");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


// Payment Intent
const postPayment = tryCatch(async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
});

module.exports = {
    postPayment,
};
