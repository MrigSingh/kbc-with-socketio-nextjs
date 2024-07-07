import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "@mui/material";
import BasicModal from "@/components/Modal";
import { io } from "socket.io-client";
import PlayersLobby from "@/components/PlayersLobby";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [openLobby, setOpenLobby] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket)

    socket.on("connect", () => {
      console.log("Connected to server", socket.id)
    })
     
    
    return () => {
      socket.disconnect();
    }
  },[])

  if(!socket){
    return;
  }
  
  socket.on("new-player-list", allPlayers => {
    console.log(allPlayers + " players joined");
    setJoinedPlayers(allPlayers)
  })

  console.log(joinedPlayers)
  return (
    <main className="background">
      <BasicModal socket={socket} setOpenLobby={setOpenLobby} />
      <PlayersLobby socket={socket} allPlayers={joinedPlayers} openLobby={openLobby} />
    </main>
  );
}