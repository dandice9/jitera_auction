import { useState } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { trpc } from '../utils/trpc'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const registrationCall = trpc.register.useMutation()

  const handleRegister = () => {
    setErrorMessage('')

    // eslint-disable-next-line
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      setErrorMessage('Email address is not valid')
    }
    else if(password.length < 6){
      setErrorMessage('password must have at least 6 characters')
    }
    else if(password !== confirmPassword){
      setErrorMessage('confirm password does not match')
    }
    else {
      registrationCall.mutate({
        email, password
      })
    }
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          Create new account {registrationCall.isSuccess ? 'y' : 'n'}
        </Header>
        <Form size='large' onSubmit={e => { e.preventDefault(); handleRegister() }}>
          <Segment stacked>
            <Form.Input disabled={registrationCall.isLoading} onChange={e => setEmail(e.target.value)} fluid icon='user' iconPosition='left' placeholder='E-mail address' value={email} />
            <Form.Input disabled={registrationCall.isLoading}
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Form.Input disabled={registrationCall.isLoading}
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Confirm Password'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
  
            <Button color='teal' fluid size='large'>
              Sign Up
            </Button>
          </Segment>
          {errorMessage || registrationCall.error ? (<Message negative>
            <Message.Header>Registration Failed</Message.Header>
            <p>{errorMessage || registrationCall.error?.message}</p>
          </Message>) : null}
          
          {registrationCall.isSuccess ? (<Message positive>
            <Message.Header>Your user registration was successful</Message.Header>
            <p>
            You may now <a href="/login">log-in</a> with the username you have chosen.
            </p>
          </Message>) : null}
        </Form>
      </Grid.Column>
    </Grid>
  )
}

export default Register