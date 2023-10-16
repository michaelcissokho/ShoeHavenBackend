const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
const {isLoggedIn} = require('../middleware')

router.post("/payment",isLoggedIn, (req, res) => {    
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

router.post("/refund", isLoggedIn, async (req,res, next) => {
  try {
    const refund = await stripe.refunds.create({
      charge: req.body.chargeId
    })
    return res.json(refund)
  } catch (err) {
    next(err)
  }
})

module.exports = router;