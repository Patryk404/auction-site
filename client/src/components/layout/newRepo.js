import React, { useState, useEffect } from "react";
import * as fetch from "node-fetch";
import * as cheerio from "cheerio";

const RepoList = (props) => {
  const [state, setState] = useState({
    repo: [],
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
      const $ = cheerio.load(body);

      setState({ ...state, repo: body });

      // getDean(body);
    } catch (err) {
      console.error(`Error in fetch: ${err.message}`);
    }
  };

  let icon = "https://i.postimg.cc/dQHgDG8P/Screen-Shot-2021-03-07-at-10-39-2.png";

  useEffect(() => {
    getRepo();
  }, []);
  const repoListItems = state.repo.map((repoItem, i) => {
    return (
      <div key={i} className="card">
        <img
          src="https://photos.skyline.com/uploads/block/floated_image_block_data/image/1728/floated_shutterstock_145605907.gif"
          className="thumb"
        />
        <div className="infos">
          {/* <div className="serial">{repoItem.serial_number}</div> */}
          <div className="status">{repoItem.status}</div>
          <div className="date">{repoItem.date}</div>
          <div className="address">{repoItem.address}</div>
          <div className="style">{repoItem.victorian_family}</div>
        </div>
      </div>
    );
  });

  return <div className="list-item">{repoListItems}</div>;
};

export default RepoList;
