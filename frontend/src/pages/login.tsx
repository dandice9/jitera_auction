import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { trpc } from '../utils/trpc';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const loginCall = trpc.login.useMutation()
  const token = localStorage.getItem('token')

  const handleLogin = () => {
    loginCall.mutate({
      email, password
    })
  }

  if(token){
    return <Navigate to="/" replace={true} />
  }

  if(loginCall.isSuccess){
    localStorage.setItem('token', loginCall.data.token)
    window.location.replace('/')
  }

  return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address'
              value={email} onChange={e => setEmail(e.target.value)}
              disabled={loginCall.isLoading} />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loginCall.isLoading}
              />

              <Button onClick={handleLogin} color='teal' fluid size='large'
              disabled={loginCall.isLoading}>
                Sign In
              </Button>
            </Segment>
            {loginCall.isError ? (<Message negative>
              <Message.Header>Login failed</Message.Header>
              <p>{loginCall.error.message}</p>
            </Message>) : null}
          </Form>
          <Message>
            New to us? <a href='/register'>Sign Up</a>
          </Message>
        </Grid.Column>
      </Grid>)
}

export default Login