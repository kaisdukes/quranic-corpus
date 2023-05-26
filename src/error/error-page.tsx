import { Link } from "react-router-dom";
import "./error-page.scss";
import { ReactComponent as Logo } from "../images/logo.svg";
import { Footer } from "../components/footer";

export function ErrorPage() {
  return (
    <div className="container">
      <div className="wrapper">
        <Link to={`/`}>
          <Logo className="logo" />
        </Link>
        <h1 className="title">Page not found</h1>
        <p className="description">
          We're sorry, the page you were looking for couldn't be found.
        </p>
        <Link className="home-link" to="/">
          Home Page
        </Link>
        <Footer />
      </div>
    </div>
  );
}
