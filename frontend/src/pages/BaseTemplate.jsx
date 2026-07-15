import PropTypes from "prop-types";
import NavigationBar from "../components/NavigationBar.jsx";
import Container from "react-bootstrap/Container";

export default function BaseTemplate({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavigationBar />

      <Container as="main" className="flex-grow-1">
        {children}
      </Container>

      <footer className="mt-auto py-3 text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} GardenBook. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

BaseTemplate.propTypes = {
  children: PropTypes.node,
};