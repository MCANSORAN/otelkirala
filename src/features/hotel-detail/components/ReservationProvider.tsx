"use client";

import { createContext, useContext, useState } from "react";

type ReservationContextValue = {
  selectedRoomId: string;
  selectRoom: (id: string) => void;
};

const ReservationContext = createContext<ReservationContextValue | null>(null);

// Oda listesi (sol sütun) ile talep formu (sağ sütun) arasında seçilen odayı
// paylaşmak için context. İkisi de farklı grid hücrelerinde olduğundan ortak state
// bir provider üzerinden taşınır.
export function useReservation(): ReservationContextValue {
  const value = useContext(ReservationContext);
  if (!value) {
    throw new Error("useReservation, ReservationProvider içinde kullanılmalıdır.");
  }
  return value;
}

export default function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Aynı odaya tekrar tıklamak seçimi kaldırır.
  const selectRoom = (id: string) =>
    setSelectedRoomId((current) => (current === id ? "" : id));

  return (
    <ReservationContext.Provider value={{ selectedRoomId, selectRoom }}>
      {children}
    </ReservationContext.Provider>
  );
}
