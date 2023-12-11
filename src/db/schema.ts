import { serial, pgTable, varchar, index, integer } from 'drizzle-orm/pg-core';

export const airline = pgTable(
  'airline',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug').notNull(),
    name: varchar('name').notNull(),
    iataCode: varchar('iata_code').notNull().unique(),
    logoPath: varchar('logo_path'),
  },
  (table) => {
    return {
      iataCodeIndex: index('iata_code_index').on(table.iataCode),
    };
  },
);

export const route = pgTable('route', {
  id: serial('id').primaryKey(),
  airlineIata: varchar('airline_iata')
    .notNull()
    .references(() => airline.iataCode),
  originIata: varchar('origin_iata')
    .notNull()
    .references(() => airport.iataCode),
  destinationIata: varchar('destination_iata')
    .notNull()
    .references(() => airport.iataCode),
  aircraftCodes: varchar('aircraft_codes').notNull(),
  averageDuration: integer('average_duration').notNull(),
});

export const airport = pgTable(
  'airport',
  {
    id: serial('id').primaryKey(),
    iataCode: varchar('iata_code').notNull().unique(),
    name: varchar('name').notNull(),
    city: varchar('city').notNull(),
    country: varchar('country').notNull(),
  },
  (table) => {
    return {
      iataCodeIndex: index('iata_code_index').on(table.iataCode),
    };
  },
);

export const aircraft = pgTable(
  'aircraft',
  {
    id: serial('id').primaryKey(),
    iataCode: varchar('iata_code').notNull().unique(),
    modelName: varchar('model_name').notNull(),
  },
  (table) => {
    return {
      iataCodeIndex: index('iata_code_index').on(table.iataCode),
    };
  },
);
