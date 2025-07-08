import React, { useState } from 'react';
import Header from '../../Component/Header';
import { Footer } from '../../Component/Footer';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [seats, setSeats] = useState(Array(30).fill({ ticket: '', locked: false }));
  const [groupMode, setGroupMode] = useState(false);
  const [groupedTickets, setGroupedTickets] = useState([]);
  const [ticketAssignments, setTicketAssignments] = useState({});

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

    if (seats[index].ticket) {
      restoreTicket(seats[index].ticket);
    }

    updated[index] = { ...updated[index], ticket: ticketText };
    setSeats(updated);

    setTicketAssignments(prev => ({ ...prev, [ticketText]: index + 1 }));
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
      setSeats(updated);

      const newAssignments = { ...ticketAssignments };
      group.forEach((t, i) => {
        newAssignments[t] = start + i + 1;
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
        setSeats(updated);

        const newAssignments = { ...ticketAssignments };
        group.forEach((t, i) => {
          newAssignments[t] = leftStart + i + 1;
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
    setSeats(seats.map(s => s.ticket ? { ...s, locked: true } : s));
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
    setSeats(updated);
    restoreTicket(ticketText);
    setTicketAssignments(prev => {
      const updatedAssignments = { ...prev };
      delete updatedAssignments[ticketText];
      return updatedAssignments;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-200 to-red-200 p-4">
      <Header />
      <div className="container mx-auto mt-16">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex gap-2 mb-4">
            <button onClick={addTicket} className="bg-orange-500 text-white px-4 py-2 rounded">Add Ticket +</button>
            <button onClick={handleGroup} className="bg-green-600 text-white px-4 py-2 rounded">Group All Tickets</button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tickets.map(ticket => (
              <div key={ticket} draggable
                className={`p-2 rounded text-white cursor-grab ${groupMode && groupedTickets.includes(ticket) ? 'bg-red-600' : 'bg-orange-500'}`}
                onDragStart={e => e.dataTransfer.setData('text/plain', groupMode && groupedTickets.length > 1 ? 'GROUP:' + groupedTickets.join(',') : ticket)}>
                {ticket}
              </div>
            ))}
          </div>

          <h5 className="text-lg font-bold mb-2">Available Seats</h5>
          <div className="flex flex-wrap gap-2">
            {seats.map((seat, i) => (
              <div key={i}
                className={`w-20 h-20 flex flex-col justify-center items-center rounded text-white relative ${seat.locked ? 'bg-red-800' : seat.ticket ? 'bg-red-500' : 'bg-green-500'}`}
                onDragOver={e => !seat.locked && e.preventDefault()}
                onDrop={e => handleDrop(i, e.dataTransfer.getData('text/plain'))}
                draggable={!seat.locked && seat.ticket}
                onDragStart={e => {
                  if (!seat.locked && seat.ticket) {
                    e.dataTransfer.setData('text/plain', seat.ticket);
                    const updated = [...seats];
                    updated[i] = { ...updated[i], ticket: '' };
                    setSeats(updated);
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
                  <div className="mt-1 flex items-center">
                    {seat.ticket}
                    {!seat.locked && (
                      <button className="ml-1 bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded" onClick={() => removeFromSeat(i)}>×</button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button onClick={confirmSeats} className="mt-4 bg-red-700 text-white px-4 py-2 rounded">Confirm All Seats</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
