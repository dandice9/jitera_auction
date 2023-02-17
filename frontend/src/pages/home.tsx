import React, { useState } from 'react'
import { Table, Button, Modal } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { trpc } from '../utils/trpc'

type BidItem = {
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
    type: string
    dimmer?: string
}

function modalReducer(state: any, action: ModalAction) {
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

    const [state, dispatch] = React.useReducer(modalReducer, {
        open: false,
        dimmer: undefined,
      })
    const { open, dimmer } = state

    const openBidQuery = trpc.openListing.useQuery()
    const completedBidQuery = trpc.completedListing.useQuery()

    const queryData = !showCompleted ? openBidQuery : completedBidQuery
    const tableData = queryData.isSuccess ? queryData.data : [] as Array<BidItem>

    const displayMenuClicked = (isCompletedClicked: boolean) => {
        setShowCompleted(isCompletedClicked)
        if(isCompletedClicked){
            completedBidQuery.refetch()
        }
        else {
            openBidQuery.refetch()
        }
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
                            onClick={() => dispatch({ type: 'OPEN_MODAL', dimmer: 'blurring' })}
                        >
                            Call Bid
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
            <Modal.Header>Use Google's location service?</Modal.Header>
            <Modal.Content>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
            </Modal.Content>
            <Modal.Actions>
            <Button negative onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                Disagree
            </Button>
            <Button positive onClick={() => dispatch({ type: 'CLOSE_MODAL' })}>
                Agree
            </Button>
            </Modal.Actions>
        </Modal>
    </div>;
}