import NavBar from "../../components/NavBar/NavBar.jsx";
import "./App.css"

function App() {
  return (
    <>
      <NavBar />
      <div className="home-container">
        <h1>
          Welcome to <span>GoldenCare</span> 
        </h1>
        <p>Your trusted elderly care platform.</p>
      </div>
    </>
  );
}

export default App;
