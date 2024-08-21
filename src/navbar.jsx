import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function Navbarb({ isLogin, onLogout }) {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">My Daily Jira</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {/* <Nav.Link href="#features">Features</Nav.Link> */}
          </Nav>
          <Nav>
            {!isLogin ? (
              <>
                <Nav.Link href="/signup">Signup</Nav.Link>
                <Nav.Link href="/signin">Signin</Nav.Link>
              </>
            ) : (
              <Button variant="outline-light" onClick={onLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navbarb;
