import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const airline = pgTable(
  'airline',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug').notNull(),
    name: varchar('name').notNull(),
    iataCode: varchar('iata_code').notNull().unique(),
    logoPath: varchar('logo_path').notNull().default(''),
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

export const airportSizeEnum = pgEnum('airport_size', [
  'small',
  'medium',
  'large',
]);

export const airport = pgTable(
  'airport',
  {
    id: serial('id').primaryKey(),
    iataCode: varchar('iata_code').notNull().unique(),
    icaoCode: varchar('icao_code'),
    name: varchar('name').notNull(),
    city: varchar('city').notNull(),
    country: varchar('country').notNull(),
    latitude: varchar('latitude').notNull().default(''),
    longitude: varchar('longitude').notNull().default(''),
    elevation: varchar('elevation'),
    size: airportSizeEnum('size'),
  },
  (table) => {
    return {
      iataCodeIndex: index('iata_code_index').on(table.iataCode),
      icaoCodeIndex: index('icao_code').on(table.icaoCode),
      nameIndex: index('name_index').on(table.name),
      cityIndex: index('city_index').on(table.city),
      countryIndex: index('country_index').on(table.country),
    };
  },
);

export const aircraft = pgTable(
  'aircraft',
  {
    id: serial('id').primaryKey(),
    iataCode: varchar('iata_code').notNull().unique(),
    modelName: varchar('model_name').notNull(),
    shortName: varchar('short_name').notNull().default(''),
  },
  (table) => {
    return {
      iataCodeIndex: index('iata_code_index').on(table.iataCode),
      modelNameIndex: index('model_name_index').on(table.modelName),
    };
  },
);

export const user = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    clerkId: varchar('clerk_id').unique(),
    emailAddress: varchar('email_address').unique(),
    profilePictureUrl: varchar('profile_picture_url'),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }),
    requestedDeletionAt: timestamp('requested_deletion_at', {
      withTimezone: true,
    }),
    admin: boolean('admin').default(false),
    firstName: varchar('first_name'),
    lastName: varchar('last_name'),
  },
  (table) => {
    return {
      clerkIdIndex: index('clerk_id_index').on(table.clerkId),
    };
  },
);

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  feedbackText: varchar('feedback_text', { length: 500 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const userRoute = pgTable(
  'user_route',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    routeId: integer('route_id')
      .notNull()
      .references(() => route.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      userRouteIndex: unique('user_route_index').on(
        table.routeId,
        table.userId,
      ),
    };
  },
);
