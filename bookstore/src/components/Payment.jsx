import React from 'react'

// Payment
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';

const PUBLIC_KEY = "pk_test_51O3vvISBtKBeVXx2foytzDgIW7KnCD5zSpMaQZsaMqbd5p6WpDYBGYWFQzg1J4kgmjAEsUosgJ1dF0NpaF3I8rM200wV7bLWBA"
const stripeTestPromise = loadStripe(PUBLIC_KEY)
import PaymentForm from './PaymentForm';

function Payment() {
    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm />
        </Elements>
    )
}

export default Payment