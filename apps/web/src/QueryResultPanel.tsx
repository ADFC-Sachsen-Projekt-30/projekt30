import "leaflet/dist/leaflet.css";
import { useStore } from "./store";
import type { NamedObjectWithPosition } from "./types";

export function QueryResultPanel() {
  const {
    queryCoord,
    queryResult,
    mainStreetsAtCoord,
    adminUnitAtCoord,
    adminUnitsSaxony,
  } = useStore();

  function ListMainStreets() {
    /* Create a  list entry for each Street we found*/
    if (mainStreetsAtCoord) {
      return (
        <>
          <ul>
            {mainStreetsAtCoord.map(
              (mainStreetAtCoord: NamedObjectWithPosition) => (
                <li key={mainStreetAtCoord.name}> {mainStreetAtCoord.name} </li>
              ),
            )}
          </ul>
        </>
      );
    }
  }

  function ShowAdminUnit() {
    /* Shows the administrive unit found at the coordinate*/
    if (adminUnitAtCoord) {
      const adminUnitData = adminUnitsSaxony?.find((adminUnit) => {
        return adminUnitAtCoord.amtlicher_schluessel == adminUnit.SCHLNR;
      });

      let anschrift = "";
      let email = "";
      if (adminUnitData) {
        anschrift =
          adminUnitData.AMTSBEZ_BM +
          " " +
          adminUnitData.TITEL +
          " " +
          adminUnitData.BM_NACHNAME +
          ", " +
          adminUnitData.STRASSE +
          " in " +
          adminUnitData.PLZ +
          " " +
          adminUnitData.ORT;
        email = adminUnitData.E_MAIL;
      }

      return (
        <>
          {adminUnitAtCoord.name}
          <p>{anschrift}</p>
          <p>{email}</p>
        </>
      );
    }
  }

  function ListResults() {
    /* Listet alle gefundenen Schulen im Umkreis der Suchkoordinate auf */
    if (queryResult) {
      return (
        <>
          <ul>
            {queryResult.pointsOfSchools.map(
              (school: NamedObjectWithPosition) => (
                <li key={school.name}>
                  {" "}
                  {school.name} in der Nähe von {school.position.lat},{" "}
                  {school.position.lng}
                </li>
              ),
            )}
          </ul>
        </>
      );
    }
  }

  return (
    <div>
      <div>
        <h1>Mögliche Gründe für Tempo 30</h1>
        {queryCoord ? (
          <h3>
            Suche an Koordinate {queryCoord?.lat}, {queryCoord?.lng}
          </h3>
        ) : (
          ""
        )}
        TODO "Ladebalken" solange queries ausgeführt werden
        <h3>Möglicherweise betroffene Straßen</h3>
        TODO Auswahl bei mehreren Straßen TODO Zusammenführen von Straßen, die
        den gleichen Namen haben (?)
        <ListMainStreets />
        <h3> Zuständige Behörde: </h3>
        <ShowAdminUnit />
        TODO Mapping von Gemeinde/Stadt auf die zuständige Behörde (mit Adresse
        / E-Mail etc.)
        <h3>Schulen, die Tempo 30 ermöglichen könnten</h3>
        TODO: Auswahl und dann Checkliste / Wizzard starten:
        <ul>
          <li> Ist die Schule allgemeinbildend (d.h. ...)?</li>
          <li> Liegt sie direkt an der Straße (d.h. ...)?</li>
          <li> weitere Prüfkriterien</li>
        </ul>
        Gefundene Schulen:
        <ListResults />
      </div>
    </div>
  );
}
