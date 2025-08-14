import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleIsAddFriendOpen() {
    setIsAddFriendOpen(!isAddFriendOpen);
  }

  function handleAddFriend(friend) {
    setFriendsList((prev) => [...prev, friend]);
    setIsAddFriendOpen();
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setIsAddFriendOpen();
  }

  function handleSplitBill(value) {
    setFriendsList((friendsList) =>
      friendsList.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friendsList}
          onSelectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {isAddFriendOpen && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <Button onClick={handleIsAddFriendOpen}>
          {isAddFriendOpen ? "Close" : "Add Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selectedFriend, onSelectFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes your {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}

      <Button
        onClick={() => {
          onSelectFriend(friend);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!friendName || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name: friendName,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };

    handleAddFriend(newFriend);

    setFriendName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [payedByUser, setPayedByuser] = useState("");
  const [payee, setPayee] = useState("user");

  const paidByFriend = bill ? bill - payedByUser : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !payedByUser) return;

    onSplitBill(payee === "user" ? paidByFriend : -payedByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>{`Split bill with ${friend.name}`} </h2>

      <label>Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expenses</label>
      <input
        type="text"
        value={payedByUser}
        onChange={(e) =>
          setPayedByuser(
            Number(e.target.value) > bill ? payedByUser : Number(e.target.value)
          )
        }
      />

      <label>{`${friend.name}'s expenses`}</label>
      <input type="text" disabled value={paidByFriend} />

      <label>Who is playing the bill?</label>
      <select value={payee} onChange={(e) => setPayee(e.target.value)}>
        <option value={"user"}>You</option>
        <option value={"friend"}>{friend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
