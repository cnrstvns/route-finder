import { EventSchemas, Inngest } from 'inngest';

type AdminAddAirline = {
  data: {
    iataCode: string;
  };
};

type Events = {
  'admin/airline.add': AdminAddAirline;
};

export const inngest = new Inngest({
  id: process.env.INNGEST_ID,
  schemas: new EventSchemas().fromRecord<Events>(),
});
