import { useState } from "react"
import { Form, Segment, Button, Grid, Message } from "semantic-ui-react"
import { trpc } from "../utils/trpc"
import { useNavigate, useOutletContext } from "react-router-dom"
import { UseTRPCQueryResult } from "@trpc/react-query/dist/shared"

const Deposit = () => {
    const [amount, setAmount] = useState('10')
    const navigate = useNavigate();
    const profileQuery = useOutletContext() as UseTRPCQueryResult<any, any>
    const depositCall = trpc.deposit.useMutation({
        onSuccess: () => {
            profileQuery.refetch()
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        depositCall.mutate(Number(amount))
    }

    return <div>
        <hr/>
        <Form size='large' onSubmit={handleSubmit}>
            <Segment stacked>
                <Form.Input disabled={depositCall.isLoading} fluid icon='money' iconPosition='left' placeholder='Deposit amount' value={amount} onChange={e => setAmount(e.target.value)} />

                <Grid>
                    <Grid.Column textAlign="center">
                        <Button disabled={depositCall.isLoading} color="teal">Deposit</Button>
                        <Button disabled={depositCall.isLoading} onClick={() => navigate('/')} type="reset" color="red">Cancel</Button>
                    </Grid.Column>
                </Grid>
            </Segment>

            {depositCall.isSuccess ? (<Message positive>
                    <Message.Header>Deposit of ${depositCall.data.amount} was success.</Message.Header>
                    <p>
                        Your balance was updated from ${depositCall.data.pre_balance} to ${depositCall.data.post_balance}
                    </p>
                    <p>
                        Go to <a href="/">Homepage</a> to start bidding!
                    </p>
                </Message>) : null}
          </Form>
    </div>
}

export default Deposit