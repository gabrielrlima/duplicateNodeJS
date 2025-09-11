import type { SWRConfiguration } from 'swr';
import type { ICalendarEvent } from 'src/types/calendar';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions: SWRConfiguration = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type EventsData = {
  events: ICalendarEvent[];
};

export function useGetEvents() {
  // TODO: Remover esta condição quando o backend estiver pronto
  // Temporariamente desabilitado para evitar erros 404 durante desenvolvimento
  const shouldFetch = enableServer;

  const { data, isLoading, error, isValidating } = useSWR<EventsData>(
    shouldFetch ? CALENDAR_ENDPOINT : null, // null desabilita o SWR
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    // Se o servidor estiver desabilitado, retornar dados vazios
    if (!enableServer) {
      console.log('📅 Calendar API desabilitada - aguardando backend');
      return {
        events: [],
        eventsLoading: false,
        eventsError: null,
        eventsValidating: false,
        eventsEmpty: true,
      };
    }

    const events = data?.events.map((event) => ({ ...event, textColor: event.color }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !isValidating && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.post(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */

  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events || [];

      const events = [...currentEvents, eventData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventData };
    await axios.put(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */

  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events || [];

      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work on server
   */
  if (enableServer) {
    const data = { eventId };
    await axios.patch(CALENDAR_ENDPOINT, data);
  }

  /**
   * Work in local
   */

  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events || [];

      const events = currentEvents.filter((event) => event.id !== eventId);

      return { ...currentData, events };
    },
    false
  );
}
