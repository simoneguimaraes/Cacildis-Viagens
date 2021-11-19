import {Routes, Route} from "react-router-dom"
import Home from "./home/Home"
import NavBar from "./navbar/NavBar"

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="voos" element="" />
        <Route path="cadastro" element="" />
        <Route path="editar-cadastro" element="" />
        <Route path="login" element="" />
        <Route path="confirmacao" element="" />
        <Route path="pagamento" element="" />
        <Route path="cartao-embarque" element="" />
        <Route path="reservas" element="" />
      </Routes>
    </div>
  );
}

export default App;
