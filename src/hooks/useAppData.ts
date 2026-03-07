import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toBooking, toPrison, toTrip } from "@/lib/mappers";

export function useMotoristasQuery() {
  return useQuery({
    queryKey: ["motoristas"],
    queryFn: api.listMotoristas,
  });
}

export function usePresidiosQuery() {
  return useQuery({
    queryKey: ["presidios"],
    queryFn: api.listPresidios,
  });
}

export function useViagensQuery() {
  return useQuery({
    queryKey: ["viagens"],
    queryFn: api.listViagens,
  });
}

export function useReservasQuery() {
  return useQuery({
    queryKey: ["reservas"],
    queryFn: api.listReservas,
  });
}

export function useAppData() {
  const motoristasQuery = useMotoristasQuery();
  const presidiosQuery = usePresidiosQuery();
  const viagensQuery = useViagensQuery();
  const reservasQuery = useReservasQuery();

  const usersById = useMemo(() => new Map<string, any>(), []);
  const apiUsersById = useMemo(() => new Map<string, any>(), []);

  const prisons = useMemo(() => (presidiosQuery.data ?? []).map(toPrison), [presidiosQuery.data]);

  const prisonsById = useMemo(() => {
    const map = new Map<string, (typeof presidiosQuery.data)[number]>();
    (presidiosQuery.data ?? []).forEach((presidio) => {
      map.set(presidio.id, presidio);
    });
    return map;
  }, [presidiosQuery.data]);

  const trips = useMemo(() => {
    return (viagensQuery.data ?? []).map((viagem) => toTrip(viagem, apiUsersById, prisonsById));
  }, [viagensQuery.data, apiUsersById, prisonsById]);

  const tripsById = useMemo(() => {
    const map = new Map<string, (typeof trips)[number]>();
    trips.forEach((trip) => map.set(trip.id, trip));
    return map;
  }, [trips]);

  const bookings = useMemo(() => {
    return (reservasQuery.data ?? []).map((reserva) => toBooking(reserva, tripsById, apiUsersById));
  }, [reservasQuery.data, tripsById, apiUsersById]);

  const isLoading =
    motoristasQuery.isLoading || presidiosQuery.isLoading || viagensQuery.isLoading || reservasQuery.isLoading;

  const error = motoristasQuery.error || presidiosQuery.error || viagensQuery.error || reservasQuery.error;

  return {
    users: [],
    usersById,
    motoristas: motoristasQuery.data ?? [],
    prisons,
    trips,
    bookings,
    isLoading,
    error,
  };
}
