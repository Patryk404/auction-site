import React, { useState, useEffect } from "react";
import Map from "./Map";

import * as fetch from "node-fetch";

//import Geocode from "react-geocode";
import NewRepoTile from "./newRepoTile.js";

const RepoList = (props) => {
  const [state, setState] = useState({
    repo: [],
    addresses: [],
  });

  const getRepo = async () => {
    try {
      const response = await fetch("/api/v1/crawl");
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`;
        const error = new Error(errorMessage);
        throw error;
      }
      const body = await response.json();

      // Geocode.setApiKey("AIzaSyBIa95EK04YAEKm3rg3QN0nbxmRpTRIwk4");
      // Geocode.setLanguage("en");
      // Geocode.setRegion("us");
      //Geocode.enableDebug();
      const auctions_addresses = [];
      body.allAuctions.map(async (auction) => {
        let response2 = await fetch(
          `https://api.opencagedata.com/geocode/v1/geojson?q=${auction.address}&key=5d72e4941deb43e2ad787f1e9fe5a68b&pretty=1`
        );
        response2 = await response2.json();
        console.log(response2);
        const location = {
          lat: response2.features[0].geometry.coordinates[0],
          lng: response2.features[0].geometry.coordinates[1],
        };

        sendLocationToDb(location);

        // const response = await Geocode.fromAddress(auction.address);
        auctions_addresses.push({
          location: location,
          address: auction.address,
        });
      });

      const sendLocationToDb = async (location) => {
        try {
          const response = await fetch(`/api/v1/crawl`, {
            method: "POST",
            headers: new Headers({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify(location),
          });
          if (!response.ok) {
            if (response.status === 422) {
              const body = await response.json();
              const newErrors = translateServerErrors(body.errors);

              return setErrors(newErrors);
            } else {
              const errorMessage = `${response.status} (${response.statusText})`;
              const error = new Error(errorMessage);
              throw error;
            }
          } else {
            return;
          }
        } catch (error) {
          console.error(`Error in fetch: ${error.message}`);
        }
      };

      setState({ ...state, repo: body.allAuctions, addresses: auctions_addresses });
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  useEffect(() => {
    getRepo();
  }, []);

  const repoListItems = state.repo.map((repoItem, i) => {
    if (repoItem.date) {
      if (repoItem.status) {
        if (
          !repoItem.status.toUpperCase().includes("SOLD") &&
          !repoItem.date.toUpperCase().includes("SOLD") &&
          !repoItem.status.toUpperCase().includes("CANCEL")
        ) {
          return <NewRepoTile key={i} repoData={repoItem} user={props.user} />;
        }
      } else {
        return <NewRepoTile key={i} repoData={repoItem} user={props.user} />;
      }
    }
  });

  const refreshDatabaseHandleClickButton = async () => {
    await fetch("/api/v1/crawl/scrap");
  };

  return (
    <>
      <div className="map">
        <Map alt="map, centered in the Mass area, markers displayed on each auction location." />
      </div>
      <div className="button-container">
        <a className="button large secondary " onClick={refreshDatabaseHandleClickButton}>
          Refresh Auctions
        </a>
      </div>

      <div className="list-item">{repoListItems}</div>
    </>
  );
};

export default RepoList;
