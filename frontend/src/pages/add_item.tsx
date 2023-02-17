import { Form, Segment, Button, Grid, Message } from "semantic-ui-react"
import { trpc } from "../utils/trpc"
import { useState } from "react"
import Datepicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'

const AddItem = () => {
    const createItemCall = trpc.addItem.useMutation()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('10')
    const [isNameError, setIsNameError] = useState(false)
    const [isDescriptionError, setIsDescriptionError] = useState(false)
    const [startDate, setStartDate] = useState(moment().startOf('day').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('day').toDate());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        setIsNameError(false)
        setIsDescriptionError(false)

        if(!name){
            setIsNameError(true)
        }
        else if(!description){
            setIsDescriptionError(true)
        }
        else {
            createItemCall.mutate({
                name, description, base_price: Number(price), bid_start_at: startDate.getTime(), bid_end_at: endDate.getTime()
            })

            setName('')
            setDescription('')
            setPrice('10')
        }
    }

    return <div>
    <hr/>
    <Form size='large' className="ui form" onSubmit={handleSubmit}>
        <Segment stacked>
            <Form.Input disabled={createItemCall.isLoading} error={isNameError} fluid icon='box' iconPosition='left' placeholder='Item name' value={name} onChange={e => setName(e.target.value)} />
            <Form.TextArea disabled={createItemCall.isLoading} error={isDescriptionError} fluid iconPosition='left' placeholder='describe item details' value={description} onChange={e => setDescription(e.target.value)} />
            <Form.Input disabled={createItemCall.isLoading} fluid icon='money' iconPosition='left' placeholder='Price' value={price} onChange={e => setPrice(e.target.value)} />

            <Form.Field>
                <Datepicker showTimeSelect dateFormat="Pp" timeIntervals={10} selected={startDate} onChange={(date) => {if(date)setStartDate(date)}} />
            </Form.Field>

            <Form.Field>
                <Datepicker showTimeSelect dateFormat="Pp" timeIntervals={10} selected={endDate} onChange={(date) => {if(date) setEndDate(date)}} />
            </Form.Field>

            <Form.Field>
                <Grid>
                    <Grid.Column textAlign="center">
                        <Button disabled={createItemCall.isLoading} color="teal">Add Item</Button>
                        <Button disabled={createItemCall.isLoading} onClick={() => window.location.replace('/')} type="reset" color="red">Cancel</Button>
                    </Grid.Column>
                </Grid>
            </Form.Field>
        </Segment>

        {createItemCall.isSuccess ? (<Message positive>
                <Message.Header>Registration of {createItemCall.data.name} was success.</Message.Header>
                <p>
                    Item price started from ${createItemCall.data.base_price}.
                </p>
                <p>
                    Go to <a href="/">Homepage</a> to view listing
                </p>
            </Message>) : null}
      </Form>
</div>
}

export default AddItem