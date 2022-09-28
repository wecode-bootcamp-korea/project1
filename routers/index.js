const express = require('express')

const router = express.Router();

const userRouter = require('./userRouter');
const orderRouter = require('./orderRouter');
const productRouter = require('./productRouter');
const searchRouter = require('./searchRouter')
const cartRouter = require('./cartRouter')

router.use('/user', userRouter);
router.use('/order', orderRouter);
router.use('/products', productRouter);
router.use('/search', searchRouter);
router.use('/cart', cartRouter);

module.exports = router;