import React, { useEffect } from "react";
import "./group.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import axios from "axios";

const Group = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [groupId, setGroupId] = useState("");
  const [createdGroupId, setCreatedGroupId] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [groupDetails, setGroupDetails] = useState(null);

  useEffect(() => {
    const urlGroupId = searchParams.get("groupId");
    if (urlGroupId) {
      setGroupId(urlGroupId);
    }
  }, []);

  //create group
  const createGroup = async () => {
    const response = await axios.post(
      url + "/api/group/create",
      {},
      { headers: { token } },
    );
    if (response.data.success) {
      setCreatedGroupId(response.data.groupId);
      const newInviteLink = `http://localhost:5173/group?groupId=${response.data.groupId}`;

      setInviteLink(newInviteLink);
      navigator.clipboard.writeText(newInviteLink);
    } else {
      alert("Error creating group");
    }
  };

  //Join Group

  const joinGroup = async () => {
    const response = await axios.post(
      url + "/api/group/join",
      { groupId },
      { headers: { token } },
    );
    if (response.data.success) {
      alert("Joined Successfully");
      localStorage.setItem("groupId", groupId);
      fetchGroupDetails();
    } else {
      alert("Error joining group");
    }
  };

  //fetch group details
  const fetchGroupDetails = async () => {
    const response = await axios.post(
      url + "/api/group/get",
      { groupId },
      { headers: { token } },
    );

    if (response.data.success) {
      setGroupDetails(response.data.group);
    } else {
      alert("Group not found");
    }
  };

  // place group order
  const proceedToCheckout = () => {
    localStorage.setItem("groupId", groupDetails.groupId);
    navigate("/order");
  };

  const totalAmount = groupDetails
    ? groupDetails.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      )
    : 0;

  return (
    <div className="group-container">
      <h2>Group Order</h2>

      <button onClick={createGroup}>Create Group</button>

      {createdGroupId && (
        <p>
          {" "}
          Your Group ID: <b>{createdGroupId}</b>
          {inviteLink && (
            <div className="invite-box">
              <p>Invite Link Ready </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  alert("Invite Link Copied!");
                }}
              >
                Copy Invite Link
              </button>
            </div>
          )}
        </p>
      )}
      <hr />

      <h3>Join Group</h3>

      <input
        type="text"
        placeholder="Enter Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
      />

      <button onClick={joinGroup}> Join </button>

      {groupDetails && (
        <div className="group-details-box">
          <h3>Group Details</h3>
          <p>
            <b>Host:</b> {groupDetails.host}{" "}
          </p>
          <p>
            <b>Total Members:</b> {groupDetails.members.length}
          </p>
          <p>
            <b>Status:</b>
            {groupDetails.status}
          </p>
          <h4>Members</h4>
          {groupDetails.members.map((member, index) => (
            <p key={index}>
              {member.name} : {member.paymentStatus}
            </p>
          ))}
        </div>
      )}

      {groupDetails && (
        <div className="shared-cart-box">
          <h4>Shared Group Cart</h4>

          {groupDetails.items.length > 0 ? (
            groupDetails.items.map((item, index) => (
              <div key={index}>
                <p>
                  {item.name} - ${item.price} x {item.quantity}
                </p>
              </div>
            ))
          ) : (
            <p>No items added yet</p>
          )}
        </div>
      )}

      {groupDetails && (
        <div className="split-bill-box">
          <h4>Split Bill</h4>
          <p>
            <b>Total Amount: </b> ${totalAmount}
          </p>
          <p>
            <b>Members:</b> {groupDetails.members.length}
          </p>
          <p>
            <b>Per Person:</b> $
            {Math.ceil(totalAmount / groupDetails.members.length)}
          </p>
        </div>
      )}

      {groupDetails && (
        <button
          onClick={proceedToCheckout}
          disabled={groupDetails?.status === "completed"}
        >
          {groupDetails?.status === "completed"
            ? "Order Completed"
            : "Proceed to Checkout"}
        </button>
      )}
    </div>
  );
};

export default Group;
