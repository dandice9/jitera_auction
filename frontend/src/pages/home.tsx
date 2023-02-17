import React, { useState } from 'react'
import { Table, Button, Modal, Form, Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { trpc } from '../utils/trpc'
import { useOutletContext } from "react-router-dom"
import { UseTRPCQueryResult } from '@trpc/react-query/dist/shared'

type BidItem = {
    id: number,
    name: string,
    description: string,
    price: number,
    duration: string,
    closed_at: number
}

const tableHeaders = [
    'name',
    'description',
    'price',
    'duration'
    ]

type ModalAction = {
    open?: boolean
    type?: string
    dimmer?: string
}

function modalReducer(state: any, action: ModalAction) : ModalAction {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { open: true, dimmer: action.dimmer }
        case 'CLOSE_MODAL':
            return { open: false }
        default:
            throw new Error()
    }
}

export default function Home(){
    const [showCompleted, setShowCompleted] = useState(false)
    const [id, setId] = useState(0)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState(0)

    const [state, dispatch] = React.useReducer(modalReducer, {
        open: false,
        dimmer: undefined
      })
    const { open, dimmer } = state

    const openBidQuery = trpc.openListing.useQuery()
    const completedBidQuery = trpc.completedListing.useQuery()

    const queryData = !showCompleted ? openBidQuery : completedBidQuery
    const tableData = queryData.isSuccess ? queryData.data : [] as Array<BidItem>
    
    const profileQuery = useOutletContext() as UseTRPCQueryResult<any, any>

    const bidCall = trpc.bidItem.useMutation({
        onSuccess() {
            openBidQuery.refetch()
            profileQuery.refetch()
        },
    })

    const displayMenuClicked = (isCompletedClicked: boolean) => {
        setShowCompleted(isCompletedClicked)

        if(isCompletedClicked){
            completedBidQuery.refetch()
        }
        else {
            openBidQuery.refetch()
        }
    }

    const handleSubmit = () => {
        bidCall.mutate({
            id, bid_price: amount
        })
    }

    return <div>
        <hr/>
        <div>
            <Button active={!showCompleted} onClick={() => displayMenuClicked(false)}>Ongoing</Button>
            <Button active={showCompleted} onClick={() => displayMenuClicked(true)}>Completed</Button>
        </div>
        <Table sortable celled fixed>
            <Table.Header>
            <Table.Row>
                {tableHeaders.map((label: string) => {
                    return <Table.HeaderCell
                    className='center aligned'
                    >
                    {label.replace(/^\w/, c => c.toUpperCase())}
                    </Table.HeaderCell>
                })}
                <Table.HeaderCell className='center aligned'>
                    Action
                </Table.HeaderCell>
            </Table.Row>
            </Table.Header>
            <Table.Body>
            {tableData.map((obj) => (
                <Table.Row key={obj.name}>
                    <Table.Cell className='center aligned'>{obj.name}</Table.Cell>
                    <Table.Cell className='center aligned'>{obj.description}</Table.Cell>
                    <Table.Cell className='center aligned'>${obj.price}</Table.Cell>
                    <Table.Cell className='center aligned'>{obj.duration}</Table.Cell>
                    <Table.Cell className='center aligned'>
                        {showCompleted ? <small color='green'>completed</small> : <Button
                            onClick={() => { 
                                setAmount(Number(obj.price) + 5);
                                setId(obj.id);
                                setName(obj.name);
                                dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' }) }}
                        >
                            Bid
                        </Button>}
                    </Table.Cell>
                </Table.Row>
            ))}
            </Table.Body>
        </Table>
            <Modal
                dimmer={dimmer}
                open={open}
                onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
            >
            <Modal.Header>Call bid on {name}</Modal.Header>
            <Modal.Content>
                <Form.Input fluid icon='money' iconPosition='left' placeholder='Deposit amount' value={amount} onChange={e => setAmount(Number(e.target.value))} />
                
                {bidCall.isSuccess ? <Message color='green'>Bid success!</Message> : null}
                {bidCall.isError ? <Message color='red'>{bidCall.error.message}</Message> : null}
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => { bidCall.reset();dispatch({ type: 'CLOSE_MODAL' }) }}>
                    Close
                </Button>
                <Button positive onClick={handleSubmit}>
                    Confirm
                </Button>
            </Modal.Actions>
        </Modal>
    </div>;
}