import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaLandmark } from 'react-icons/fa';



export default function Home() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selected Hall, setSelected Hall] = useState('A');
  const [tickets, setTickets] = useState([]);
  const [seatsMap, setSeatsMap] = useState({
    A: Array(30).fill({ ticket: '', locked: false }),
    B: Array(30).fill({ ticket: '', locked: false }),
    C: Array(30).fill({ ticket: '', locked: false })
  });
  const [groupMode, setGroupMode] = useState(false);
  const [groupedTickets, setGroupedTickets] = useState([]);
  const [ticketAssignments, setTicketAssignments] = useState({});

  const seats = seatsMap[selected Hall];

  const updateSeats = (newSeats) => {
    setSeatsMap(prev => ({ ...prev, [selected Hall]: newSeats }));
  };

  const addTicket = () => {
    const confirmed = seats.filter(s => s.ticket.startsWith('T-')).map(s => parseInt(s.ticket.replace('T-', '')));
    const pool = tickets.map(t => parseInt(t.replace('T-', '')));
    const max = Math.max(0, ...confirmed, ...pool);
    setTickets([...tickets, `T-${max + 1}`]);
  };

  const handleGroup = () => {
    if (groupMode) {
      resetGroup();
      alert('Group mode cancelled.');
    } else {
      if (tickets.length < 2) return alert('Need 2+ tickets for group!');
      setGroupMode(true);
      setGroupedTickets([...tickets]);
      alert('Group ready! Drag any to assign all together.');
    }
  };

  const resetGroup = () => {
    setGroupMode(false);
    setGroupedTickets([]);
  };

  const handleDrop = (index, ticketText) => {
    if (seats[index].locked) return alert('Seat locked!');
    if (ticketText.startsWith('GROUP:')) {
      const group = ticketText.replace('GROUP:', '').split(',');
      assignGroupedTickets(group, index);
    } else {
      assignSingleTicket(ticketText, index);
    }
  };

  const assignSingleTicket = (ticketText, index) => {
    if (seats[index].locked) return;
    const updated = [...seats];
    if (updated[index].ticket) restoreTicket(updated[index].ticket);
    updated[index] = { ...updated[index], ticket: ticketText };
    updateSeats(updated);
    setTicketAssignments(prev => ({ ...prev, [ticketText]: `${selected Hall}-${index + 1}` }));
    setTickets(tickets.filter(t => t !== ticketText));
    setGroupedTickets(groupedTickets.filter(t => t !== ticketText));
  };

  const assignGroupedTickets = (group, start) => {
    const right = seats.slice(start, start + group.length);
    if (right.every(s => !s.locked && !s.ticket) && right.length === group.length) {
      const updated = [...seats];
      group.forEach((t, i) => {
        if (updated[start + i].ticket) restoreTicket(updated[start + i].ticket);
        updated[start + i] = { ...updated[start + i], ticket: t };
      });
      updateSeats(updated);
      const newAssignments = { ...ticketAssignments };
      group.forEach((t, i) => {
        newAssignments[t] = `${selected Hall}-${start + i + 1}`;
      });
      setTicketAssignments(newAssignments);
      setTickets(tickets.filter(t => !group.includes(t)));
      resetGroup();
      return;
    }

    const leftStart = start - group.length + 1;
    if (leftStart >= 0) {
      const left = seats.slice(leftStart, leftStart + group.length);
      if (left.every(s => !s.locked && !s.ticket) && left.length === group.length) {
        const updated = [...seats];
        group.forEach((t, i) => {
          if (updated[leftStart + i].ticket) restoreTicket(updated[leftStart + i].ticket);
          updated[leftStart + i] = { ...updated[leftStart + i], ticket: t };
        });
        updateSeats(updated);
        const newAssignments = { ...ticketAssignments };
        group.forEach((t, i) => {
          newAssignments[t] = `${selected Hall}-${leftStart + i + 1}`;
        });
        setTicketAssignments(newAssignments);
        setTickets(tickets.filter(t => !group.includes(t)));
        resetGroup();
        return;
      }
    }

    alert('No space left or right for group!');
  };

  const confirmSeats = () => {
    updateSeats(seats.map(s => s.ticket ? { ...s, locked: true } : s));
    alert('Seats confirmed.');
  };

  const restoreTicket = (ticketText) => {
    if (ticketText) {
      setTickets(prev => [...prev, ticketText]);
      if (groupMode) setGroupedTickets(prev => [...prev, ticketText]);
    }
  };

  const removeFromSeat = (index) => {
    const ticketText = seats[index].ticket;
    const updated = [...seats];
    updated[index] = { ...updated[index], ticket: '' };
    updateSeats(updated);
    restoreTicket(ticketText);
    setTicketAssignments(prev => {
      const updatedAssignments = { ...prev };
      delete updatedAssignments[ticketText];
      return updatedAssignments;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-red-100">
      <Header />
      <div className="container mx-auto pt-24 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
             <label className=" text-gray-700 font-semibold mb-1 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-600" /> Select Date
              </label>
              <div className="relative date-layout">
                <DatePicker
                  selected={selectedDate ? new Date(selectedDate) : null}
                  onChange={date => setSelectedDate(date.toISOString().split('T')[0])}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  placeholderText="Select a date"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                  <FaCalendarAlt />
                </div>
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-semibold flex items-center gap-2  mb-1">  <FaLandmark className="text-gray-600" /> Select  Hall</label>
              <select
                value={selected Hall}
                onChange={e => setSelected Hall(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 shadow focus:ring-2 focus:ring-red-300"
              >
                <option value="A"> Hall A</option>
                <option value="B"> Hall B</option>
                <option value="C"> Hall C</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={addTicket} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg shadow transition">Add Ticket +</button>
            <button onClick={handleGroup} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition">Group All Tickets</button>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {tickets.map(ticket => (
              <div key={ticket} draggable
                className={`px-3 py-2 rounded-lg shadow text-white text-sm font-semibold cursor-grab transition-all ${
                  groupMode && groupedTickets.includes(ticket) ? 'bg-red-600' : 'bg-orange-500'
                }`}
                onDragStart={e =>
                  e.dataTransfer.setData('text/plain', groupMode && groupedTickets.length > 1
                    ? 'GROUP:' + groupedTickets.join(',') : ticket)}>
                {ticket}
              </div>
            ))}
          </div>

          {/* 💺 Seat Map */}
          <h5 className="text-xl font-bold mb-2">Available Seats -  Hall {selected Hall}</h5>
          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 mb-6">
            {seats.map((seat, i) => (
              <div key={i}
                className={`h-20 flex flex-col justify-center items-center rounded-xl text-white font-semibold transition-all duration-200 relative shadow cursor-pointer ${
                  seat.locked ? 'bg-red-800' : seat.ticket ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
                onDragOver={e => !seat.locked && e.preventDefault()}
                onDrop={e => handleDrop(i, e.dataTransfer.getData('text/plain'))}
                draggable={!seat.locked && seat.ticket}
                onDragStart={e => {
                  if (!seat.locked && seat.ticket) {
                    e.dataTransfer.setData('text/plain', seat.ticket);
                    const updated = [...seats];
                    updated[i] = { ...updated[i], ticket: '' };
                    updateSeats(updated);
                    restoreTicket(seat.ticket);
                    setTicketAssignments(prev => {
                      const updatedAssignments = { ...prev };
                      delete updatedAssignments[seat.ticket];
                      return updatedAssignments;
                    });
                  }
                }}>
                <div>Seat {i + 1}</div>
                {seat.ticket && (
                  <div className="mt-1 flex items-center text-xs">
                    {seat.ticket}
                    {!seat.locked && (
                      <button className="ml-2 bg-red-600 hover:bg-red-700 w-5 h-5 text-sm flex items-center justify-center rounded-full" onClick={() => removeFromSeat(i)}>×</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button onClick={confirmSeats} className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-lg transition">
              Confirm All Seats
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
