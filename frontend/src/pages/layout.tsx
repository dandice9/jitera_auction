import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  Container,
  Dropdown,
  Menu,
  Visibility,
  Icon
} from 'semantic-ui-react'
import { trpc } from '../utils/trpc'

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  marginTop: '4em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
}

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
}

const StickyLayout = () => {
  const [menuFixed, setMenuFixed] = useState(false)
  const navigate = useNavigate();

  const stickTopMenu = () => setMenuFixed(true)
  const unStickTopMenu = () => setMenuFixed(false)

  const token = localStorage.getItem('token')

  const signOutAction = () => {
    localStorage.removeItem('token');
    navigate('/')
  }

  if(!token)
  {
    navigate('/login')
    return <></>
  }
  
  const profileQuery = trpc.check.useQuery()

  if(profileQuery.isError){
    localStorage.removeItem('token')
    window.location.replace('/login')
  }

  return (
    <div>
      {/* Attaching the top menu is a simple operation, we only switch `fixed` prop and add another style if it has
          gone beyond the scope of visibility
        */}
      <Visibility
        onBottomPassed={stickTopMenu}
        onBottomVisible={unStickTopMenu}
        once={false}
      >
        <Menu
          borderless
          fixed={menuFixed ? 'top' : undefined}
          style={menuFixed ? fixedMenuStyle : menuStyle}
        >
          <Container text>
            <Menu.Menu position='right'>
              <div>
                  <Icon size='large' name='user circle' />
                  <span className='ui text small'>{profileQuery.isLoading ? 'loading..' : profileQuery.data?.email}</span>
                  <Dropdown inline>
                      <Dropdown.Menu>
                          <Dropdown.Item>
                            <small>{profileQuery.isLoading ? 'loading..' : `My Balance: $${profileQuery.data?.balance}`}</small>
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>
                            <Link to="/add_item">Create new bid</Link>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Link to="/deposit">Deposit</Link>
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={signOutAction}>Sign Out</Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
              </div>
            </Menu.Menu>
          </Container>
        </Menu>
      </Visibility>

      <Container text style={{ marginTop: '2em' }}>
          <Outlet context={profileQuery} />
      </Container>
    </div>
  )
}

export default StickyLayout