import React from 'react'
import "./group.css"
import { useContext } from 'react'
import {StoreContext} from "../../Context/StoreContext";
import { useState } from 'react';
import axios from "axios";

const Group = () => {
    const {url,token} =useContext(StoreContext);
    const [groupId,setGroupId] = useState("");
    const joinGroup = async () => {
        const response = await axios.post(url+"/api/group/join",{groupId},{headers: {token}});
        if(response.data.success){
            alert("Joined Successfully");
            console.log(response.data.group);
            
        }
        else{
            alert("Error joining group");
        }
    };
  return (
    <div>
      <h2>Join Group</h2>
      <input type="text" placeholder='Enter Group ID' value={groupId} onChange={(e)=>setGroupId(e.target.value)} />
      <button onClick={joinGroup}>Join</button>
    </div>
  )
}

export default Group;