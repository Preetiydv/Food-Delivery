import React from 'react'
import "./group.css"
import { useContext } from 'react'
import {StoreContext} from "../../Context/StoreContext";
import { useState } from 'react';
import axios from "axios";

const Group = () => {
    const {url,token} =useContext(StoreContext);
    const [groupId,setGroupId] = useState("");
    const [createdGroupId,setCreatedGroupId] = useState("");
    const [groupDetails,setGroupDetails] = useState(null);

  //create group
  const createGroup = async () => {
    console.log("Created Group Clicked");
    
    const response = await axios.post(url + "/api/group/create",{},{headers:{token}});
    if(response.data.success){
      setCreatedGroupId(response.data.groupId);
            alert("Group Created Successfully");
        }
         else {
            alert("Error creating group");
          }
  }

  //Join Group

    const joinGroup = async () => {
        const response = await axios.post(url+"/api/group/join",{groupId},{headers: {token}});
        if(response.data.success){
            alert("Joined Successfully");
            fetchGroupDetails();
        }
        else{
            alert("Error joining group");
        }
    };

    //fetch group details
    const fetchGroupDetails = async () => {
    const response = await axios.post(
        url + "/api/group/get",
        { groupId },
        { headers: { token } }
    );

    if (response.data.success) {
        setGroupDetails(response.data.group);
    } else {
        alert("Group not found");
    }
  };

  return (
    <div className="group-container">
            <h2>Group Order</h2>

            <button onClick={createGroup}>Create Group</button>

            {createdGroupId && (
                <p> Your Group ID: <b>{createdGroupId}</b></p>
            )}
               <hr />

            <h3>Join Group</h3>

            <input type="text" placeholder="Enter Group ID" value={groupId} onChange={(e) => setGroupId(e.target.value)} />

            <button onClick={joinGroup}> Join </button>

          {
            groupDetails && (
            <div>
            <h3>Group Details</h3>
            <p><b>Host:</b> {groupDetails.host} </p>
             <p>
                <b>Total Members:</b> {groupDetails.members.length}
            </p>
           <h4>Members</h4>
            {
                groupDetails.members.map((member, index) => (
                    <p key={index}>{member}</p>
                ))
            }
            </div>
            )
          }
        </div>
  )
}

export default Group;