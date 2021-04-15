'use strict'
document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe(
        'pk_test_51IgFEzDCvdCHNC1bALZEGs3CM4qH5ZCn1aH6fFwGLhOwHD3QXgeznciLUcmX3eu8FbTSdp5oSrMzxMgjYWyjCqbJ0059RDQWpb'
    )
    const orderBtn = document.getElementById('orderBtn')

    const getStripeToken = () => {
        stripe.redirectToCheckout({
            sessionId: orderBtn.dataset.sessionId
        })
    }

    orderBtn.addEventListener('click', getStripeToken)
})
