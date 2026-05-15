"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function ReservationSection() {
  const [formData, setFormData] = useState({
    name: "",
    guests: "2",
    date: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${formData.name}! Your reservation request has been sent.`);
    setFormData({ name: "", guests: "2", date: "", time: "" });
  };

  return (
    <section id="reservation-section" className="w-full py-32 bg-white px-6 md:px-12 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-maroon/5 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-maroon/5 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <ScrollReveal>
          <div className="flex flex-col space-y-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 leading-none">
              BOOK A <br />
              <span className="text-maroon">MOMENT</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-md font-light leading-relaxed">
              Experience the serene atmosphere of SKY HAUSSS. Reserve a table for your meetings, dates, or a quiet moment of reflection.
            </p>
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-off-white flex items-center justify-center text-maroon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Opening Hours</h4>
                  <p className="text-sm text-gray-500">Mon - Sun: 08:00 - 22:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-off-white flex items-center justify-center text-maroon">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Location</h4>
                  <p className="text-sm text-gray-500">Skyline Tower, 42nd Floor, Jakarta</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-maroon outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Guests</label>
                  <select 
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-maroon outline-none transition-all text-gray-900 font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-maroon outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-gray-100 focus:border-maroon outline-none transition-all text-gray-900 font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-maroon transition-all duration-500 transform hover:-translate-y-1 shadow-xl"
              >
                Request Reservation
              </button>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
