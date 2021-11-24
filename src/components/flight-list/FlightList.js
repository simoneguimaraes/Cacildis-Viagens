import "./FlightList.css";
import FlightCard from "../flight-card/flight-card";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingBar from "../loading-bar/loading";
import NavBar from "../navbar/NavBar";
import InputSelect from "../input-select/InputSelect";
import ButtonDark from "../button-dark/button-dark";
import InputData from "../input-data/input-data";
import { Link } from "react-router-dom";

function FlightList(props) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  function handleChange(event) {
    props.setDadosVoos({
      ...props.dadosVoos,
      [event.target.name]: event.target.value,
    });
  }

  function reOrder(type) {
    let tempOrder;

    if (type === "price") {
      const flightsClone = [...flights];
      tempOrder = flightsClone.sort((a, b) => {
        return a.price - b.price;
      });
      setFlights(tempOrder);
    } else if (type === "time") {
      const flightsClone = [...flights];
      tempOrder = flightsClone.sort((a, b) => {
        let durationHrA = a.trip_duration.split(" hr")[0] * 60;
        let durationMinA =
          a.trip_duration.split("hr")[1] === ""
            ? 0
            : a.trip_duration.split("hr")[1].split(" ")[1];
        let durationHrB = b.trip_duration.split(" hr")[0] * 60;
        let durationMinB =
          b.trip_duration.split("hr")[1] === ""
            ? 0
            : b.trip_duration.split("hr")[1].split(" ")[1];

        return (
          Number(durationHrA) +
          Number(durationMinA) -
          (Number(durationHrB) + Number(durationMinB))
        );
      });
      setFlights(tempOrder);
    }
  }

  useEffect(() => {
    async function flightList() {
      try {
        const response = await axios.get(
          "https://ironrest.herokuapp.com/cacildis-viagens-voos-v2"
        );

        let filtred = response.data.filter((currentElement) => {
          return (
            currentElement.departure_airport_code === props.dadosVoos.origem &&
            currentElement.arrival_airport_code === props.dadosVoos.destino
          );
        });
        setFlights(filtred);

        setTimeout(() => {
          setLoading(false);
        }, 6500);
      } catch (err) {
        console.log(err);
      }
    }

    flightList();
  }, [refresh]);

  return (
    <div>
      <NavBar pag="Voos Encontrados" backButton="/" />
      {loading ? (
        <LoadingBar />
      ) : (
        <div>
          <div className="texto">
            <InputSelect
              label="Origem"
              id="origem"
              name="origem"
              onChange={handleChange}
              value={props.dadosVoos.origem}
            >
              <option value="" disabled>
                Selecione a origem
              </option>
              <option value="GRU">São Paulo - Guarulhos</option>
              <option value="GIG">Rio de Janeiro - Galeão</option>
              <option value="SSA">Salvador</option>
            </InputSelect>

            <InputSelect
              label="Destino"
              id="destino"
              name="destino"
              onChange={handleChange}
              value={props.dadosVoos.destino}
            >
              <option value="" disabled>
                Selecione o destino
              </option>
              <option value="GRU">São Paulo - Guarulhos</option>
              <option value="GIG">Rio de Janeiro - Galeão</option>
              <option value="SSA">Salvador</option>
            </InputSelect>
            <InputData
              label="Ida"
              id="data"
              name="data"
              onChange={handleChange}
              value={props.dadosVoos.data}
            />
            <div className="btn-middle">
              <ButtonDark
                content="Buscar"
                to="/voos"
                onClick={() => setRefresh(!refresh)}
              />
            </div>
            <button
              className="btn btn-dark mt-2"
              onClick={() => reOrder("price")}
            >
              Ordenar por menor preço
            </button>
            <button
              className="btn btn-dark mt-2"
              onClick={() => reOrder("time")}
            >
              Ordenar por menor tempo
            </button>
          </div>
          {flights.length === 0 ? (
            <p className="text-center mt-5">Voo não encontrado...</p>
          ) : (
            flights.map((currentElement) => {
              return (
                <Link
                  to={`/${currentElement._id}&${props.qtd}`}
                  key={currentElement._id}
                >
                  <FlightCard
                    img={currentElement.airlines.split(",")[0]}
                    departure_time={currentElement.departure_time}
                    arrival_time={currentElement.arrival_time}
                    trip_duration={currentElement.trip_duration}
                    departure_airport_code={
                      currentElement.departure_airport_code
                    }
                    arrival_airport_code={currentElement.arrival_airport_code}
                    num_stops={currentElement.num_stops}
                    price={currentElement.price * props.qtd}
                    qtd={props.qtd}
                  />
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default FlightList;
