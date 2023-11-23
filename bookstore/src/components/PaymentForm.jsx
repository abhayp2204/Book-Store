import React, { useState } from 'react'
import axios from 'axios'
import '../css/Payment.css'

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
        base: {
            backgroundColor: "#0A2463",
            iconColor: "#c4f0ff",
            color: "white",
            fontWeight: "500",
            fontSize: "24px",
        },
        invalid: {
            iconColor: "#ffc7ee",
            color: "#white"
        }
    }
}

function PaymentForm() {
    const [success, setSuccess] = useState(false)
    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async(e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
    

        if(!error) {
            try {
                const {id} = paymentMethod
                const response = await axios.post("http://localhost:5173/checkout", {
                    amount: 1000,
                    id
                })

                if(response.data.success) {
                    console.log("Succesful payment")
                    setSuccess(true)
                }
            }
            catch(error) {
                console.log("Error", error)
            }
        } else {
            console.log("Error")
        }
    }

    return (
        <div className='payment-container'>
            {!success?
                <form className='payment-container' onSubmit={handleSubmit}>
                    <fieldset className='form-group'>
                        <CardElement options={CARD_OPTIONS} />
                    </fieldset>
                    <button className='pay-button'>Pay</button>
                </form>
                :
                <div>
                    <h2>You just bought a book!</h2>
                </div>
            }
        </div>
    )
}

export default PaymentForm