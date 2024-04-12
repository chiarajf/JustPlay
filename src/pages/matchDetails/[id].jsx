import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import BlueShield from "../../../public/Blue-shield.svg";
import RedShield from "../../../public/Red-shield.svg";
import Versus from "../../../public/Versus.svg";
import styles from "./index.module.scss";
import { getCookie } from "cookies-next";

export default function SingleMatch() {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState(null);
  const playerName = getCookie("userData");

  const playerExists =
    match &&
    (match.team1.includes(playerName) || match.team2.includes(playerName));

  useEffect(() => {
    if (id) {
      fetch(`/api/matches/${id}`)
        .then((res) => res.json())
        .then((data) => setMatch(data.data));
    }
  }, [id]);

  const maxPlayersPerTeam = match ? Math.ceil(match.players / 2) : 0;
  const blueTeamIsFull = match && match.team1.length >= maxPlayersPerTeam;
  const redTeamIsFull = match && match.team2.length >= maxPlayersPerTeam;

  const handleAddPlayer = async (team) => {
    try {
      if (!playerName) {
        console.error("Player name not found in cookie");
        return;
      }

      await axios.put(`/api/matches/${id}?team=${team}`, { playerName });
      setMatch((prevMatch) => ({
        ...prevMatch,
        [team]: [...prevMatch[team], playerName],
      }));

      const playerExists = match && match[team].includes(playerName);
      if (playerExists) {
        console.error("Player already exists in the team");
        return;
      }
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleAddFriend = async (player) => {
    try {
      if (!playerName) {
        console.error("Player name not found in cookie");
        return;
      }

      // Construct the data to be sent in the PUT request
      const data = {
        newFriends: [player],
      };

      await axios.put(`/api/${playerName}`, data);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <>
      <div className={styles.teamFormations}>
        <h2>{match && match.sport}</h2>
        <h3>{match && match.location}</h3>
        <p>{match && match.phoneNumber}</p>
        <p>{match && match.date}</p>
        <p>{match && match.time}</p>
        <div className={styles.team1}>
          <Image src={BlueShield} alt="Team Blue" width={295} height={234} />
          {match &&
            match.team1.map((player, index) => (
              <div key={index}>
                <p>{player}</p>
                <button
                  className={styles.button}
                  onClick={() => {
                    handleAddFriend(player);
                  }}
                >
                  Add {player} to your frineds
                </button>
              </div>
            ))}
          <button
            text="Join Team Blue"
            onClick={() => handleAddPlayer("team1")}
            className={styles.btnAdd}
            disabled={blueTeamIsFull || playerExists}
          >
            BLUE
          </button>
        </div>
        <div className={styles.vs}>
          <Image
            src={Versus}
            alt="Versus"
            width={195}
            height={134}
            className={styles.imgVs}
          />
        </div>
        <div className={styles.team2}>
          <Image src={RedShield} alt="Team Red" width={295} height={234} />
          {match &&
            match.team2.map((player, index) => (
              <div key={index}>
                <p>{player}</p>
                <button
                  className={styles.button}
                  onClick={() => {
                    handleAddFriend(player);
                  }}
                >
                  Add {player} to your frineds
                </button>
              </div>
            ))}
          <button
            text="Join Team Red"
            onClick={() => handleAddPlayer("team2")}
            className={styles.btnAdd}
            disabled={redTeamIsFull || playerExists}
          >
            RED
          </button>
        </div>
      </div>
    </>
  );
}