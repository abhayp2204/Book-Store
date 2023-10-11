import React, { useState } from 'react'
import Card from './Card'
import '../css/Card.css'

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useSendSignInLinkToEmail } from 'react-firebase-hooks/auth'

function Cards(props) {
    const cardsRef = firestore.collection(props.type)
    const timeRef = firestore.collection('timeline')

    const [cardName, setCardName] = useState("")

    const query = cardsRef.orderBy('createdAt').limit(25)
    const [cards] = useCollectionData(query, { idField: 'id' })

    const addCard = async (e) => {
        e.preventDefault()

        await cardsRef.add({
            name: cardName,
            image: Math.floor(Math.random() * 62) + 1,
            date: props.date,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setCardName('')
    }

    const filteredCards = cards && cards.filter(card => {
        if (card.createdAt === null) return
        const cardDate = card.createdAt.toDate()
        console.log("cardDate = ", cardDate)
        return cardDate.getDate() === props.date.getDate() && cardDate.getMonth() === props.date.getMonth() && cardDate.getFullYear() === props.date.getFullYear()
    })

    const deleteCard = async (cardName) => {
        cardsRef.where("name", "==", cardName).get()
            .then(snapshot => {
                snapshot.docs[0].ref.delete()
            })
    }

    const completeCard = async (cardName) => {
        await timeRef.add({
            cardName: cardName,
            completedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        deleteCard(cardName)
    }

    return (
        <div className='cards'>
            <div className='add-card-container'>
                <input
                    className='input-card-name'
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder='add card'
                />
                <button
                    className='add-card-button'
                    onClick={(e) => addCard(e)}
                >
                    Add
                </button>
            </div>

            <div className='cards-display'>
                {filteredCards && filteredCards.map((card, key) =>
                    <Card
                        key={key}
                        card={card}
                        image={card.image}
                        onDelete={() => deleteCard(card.name)}
                        onComplete={() => completeCard(card.name)}
                    />
                )}
            </div>
        </div>
    )
}

export default Cards
