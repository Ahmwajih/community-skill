"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedUserById } from "@/lib/features/dashboard/userSlice";
import { createDeal } from "@/lib/features/deal/dealSlice";
import { sendMessage } from "@/lib/features/conversation/conversationSlice"; // Import the sendMessage thunk
import { RootState, AppDispatch } from "@/lib/store";
import { Calendar, Badge, List } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { toast } from "react-toastify";
import pusher from "@/Utils/socket";
type ModalConversationProps = {
  providerId: string;
  closeModal: () => void;
};

type Availability = {
  date: string;
  times: string[];
};

type Provider = {
  name: string;
  availability: Availability[];
};

type Seeker = {
  id: string;
};

function ModalConversation({ providerId, closeModal }: ModalConversationProps) {
  const [message, setMessage] = useState("");
  const [timeFrame, setTimeFrame] = useState("1 day");
  const [showDealFields, setShowDealFields] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [skillsOffered, setSkillsOffered] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [seeker, setSeeker] = useState<Seeker | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState<string[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  // Fetch provider data
  useEffect(() => {
    if (providerId) {
      dispatch(selectedUserById(providerId)).then((response: any) => {
        if (response.payload) {
          setProvider(response.payload.data);
        } else {
          console.error("Failed to fetch provider:", response.error.message);
        }
      });
    }
  }, [dispatch, providerId]);

  // Fetch seeker data
  useEffect(() => {
    if (user?.id) {
      dispatch(selectedUserById(user.id)).then((response: any) => {
        if (response.payload) {
          setSeeker(response.payload.data);
        } else {
          console.error("Failed to fetch seeker:", response.error.message);
        }
      });
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const channel = pusher.subscribe('conversation-channel');
    channel.bind('new-message', (data: { conversationId: string; message: Message }) => {
      // Handle new message
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (showDealFields && !skillsOffered.trim()) {
      toast.error("Please specify the skills offered.");
      return;
    }

    const dealData = {
      providerId,
      seekerId: user.id,
      timeFrame,
      skillOffered: skillsOffered,
      numberOfSessions,
      selectedAvailabilities,
      status: "pending",
      message,
    };

    try {
      await dispatch(createDeal(dealData));
      toast.success("Deal sent and created successfully!");

      // Fetch the conversation ID dynamically
      let response = await fetch(`/api/conversation?providerId=${providerId}&seekerId=${user.id}`);
      let data = await response.json();

      let conversationId = data.data?._id;

      // If conversation does not exist, create a new one
      if (!conversationId) {
        response = await fetch(`/api/conversation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId, seekerId: user.id, messages: [] }),
        });
        data = await response.json();
        conversationId = data.data._id;
      }

      // Send the message
      await dispatch(sendMessage({ conversationId, senderId: user.id, content: message }));

      resetFields();
      closeModal();
    } catch (error: any) {
      console.error("Error creating deal or sending message:", error);
      toast.error("An error occurred while sending the deal or message.");
    }
  };

  const resetFields = () => {
    setMessage("");
    setTimeFrame("1 day");
    setShowDealFields(false);
    setSkillsOffered("");
    setNumberOfSessions(1);
    setSelectedDate(null);
    setSelectedAvailabilities([]);
  };

  const getTodoList = (date: Date | null) => {
    if (!date || !provider || !provider.availability) return [];
    const dateString = date.toISOString().split("T")[0];
    const availability = provider.availability.find((avail) => avail.date === dateString);
    return availability ? availability.times.map((time) => ({ time, title: "Available" })) : [];
  };

  const renderCell = (date: Date) => {
    const list = getTodoList(date);
    if (list.length) {
      return <Badge className="calendar-todo-item-badge" />;
    }
    return null;
  };

  const TodoList = ({ date }: { date: Date | null }) => {
    const list = getTodoList(date);
    if (!list.length) return null;

    const toggleAvailability = (date: Date, time: string) => {
      const dateString = date.toISOString().split("T")[0];
      const availabilityString = `${dateString} ${time}`;
      setSelectedAvailabilities((prev) =>
        prev.includes(availabilityString)
          ? prev.filter((a) => a !== availabilityString)
          : [...prev, availabilityString]
      );
    };

    return (
      <List style={{ flex: 1 }} bordered>
        {list.map((item, index) => (
          <List.Item
            key={index}
            onClick={() => toggleAvailability(date!, item.time)}
            style={{
              backgroundColor: selectedAvailabilities.includes(
                `${date!.toISOString().split("T")[0]} ${item.time}`
              )
                ? "#e0f7fa"
                : "transparent",
            }}
          >
            <div>{item.time}</div>
            <div>{item.title}</div>
          </List.Item>
        ))}
      </List>
    );
  };

  const disabledDate = (date: Date) => {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    return date < now || date > threeMonthsLater;
  };

  return (
    <div>
      <dialog
        id="conversation-modal"
        open
        className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 sm:p-6"
      >
        <div className="modal-box w-full max-w-5xl bg-white p-6 rounded-md shadow-lg">
          <h3 className="font-bold text-brown text-xl mb-4">
            Start a Conversation with {provider?.name}
          </h3>
          <p className="text-gray mb-6">
            Please introduce yourself with a brief message and mention what you are looking for and what you can offer.
          </p>

          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-brown mb-2">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border bg-white rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Hi, I'm a frontend developer..."
              rows={4}
            />
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowDealFields(!showDealFields)}
              className="w-full bg-orange text-white py-2 px-4 border rounded-md hover:bg-orange"
            >
              {showDealFields ? "Remove Deal" : "Propose a Deal"}
            </button>
          </div>

          {showDealFields && (
            <div className="deal-fields">
              <div className="mb-4">
                <label htmlFor="timeFrame" className="block text-sm font-medium text-brown mb-2">
                  Time Frame
                </label>
                <select
                  id="timeFrame"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  className="w-full px-4 bg-white py-2 border text-gray rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1 day">1 day</option>
                  <option value="1 week">1 week</option>

                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2 months">2 months</option>
                </select>
              </div>

              {/* Skills Offered */}
              <div className="mb-4">
                <label
                  htmlFor="skillsOffered"
                  className="block text-sm font-medium text-brown mb-2"
                >
                  Skills Offered
                </label>
                <textarea
                  id="skillsOffered"
                  value={skillsOffered}
                  onChange={(e) => setSkillsOffered(e.target.value)}
                  className="w-full bg-white px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List the skills you can offer (e.g., Web Development, Graphic Design)..."
                  rows={3}
                />
              </div>

              {/* Number of Sessions Desired */}
              <div className="mb-4">
                <label
                  htmlFor="numberOfSessions"
                  className="block text-sm font-medium text-brown mb-2"
                >
                  Number of Sessions Desired
                </label>
                <input
                  type="number"
                  id="numberOfSessions"
                  value={numberOfSessions}
                  onChange={(e) => setNumberOfSessions(Number(e.target.value))}
                  className="w-full bg-white px-4 py-2 text-gray border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  placeholder="Enter the number of sessions"
                />
              </div>
            </div>
          )}

          {/* Calendar and Todo List */}
          <div className="flex flex-col sm:flex-row">
            <Calendar
              compact
              renderCell={renderCell}
              onSelect={setSelectedDate}
              style={{ width: "100%", maxWidth: 320 }}
              disabledDate={disabledDate}
            />
            <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
              <TodoList date={selectedDate} />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action flex justify-end gap-4 mt-4">
            <button
              onClick={closeModal}
              className="btn bg-gray text-white py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="btn bg-blue text-white py-2 px-6 rounded-md hover:bg-blue"
            >
              Send
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default ModalConversation;
