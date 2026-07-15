import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import "./NavigationBar.css";

// Aleena — navbar reads the session from AuthContext and swaps the
// Login link for a greeting + Logout once signed in.
export default function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Navbar expand="md" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/" className="gb-wordmark">
          GardenBook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {user && (
              <>
                <Nav.Link as={Link} to="/mygarden">
                  MyGarden
                </Nav.Link>
                <Nav.Link as={Link} to="/gardens">
                  Gardens
                </Nav.Link>
                <Nav.Link as={Link} to="/explore">
                  Explore
                </Nav.Link>
              </>
            )}
            {!user && (
              <Nav.Link as={Link} to="/explore">
                Explore
              </Nav.Link>
            )}
          </Nav>

          <Nav className="align-items-md-center gb-nav-account">
            {user ? (
              <>
                <span className="gb-nav-greeting me-2">
                  Hi, {user.displayName}
                </span>
                <Nav.Link as={Link} to="/settings">
                  Settings
                </Nav.Link>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="ms-md-2"
                  onClick={onLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
