import {
	bigint,
	index,
	integer,
	pgTable,
	serial,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

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
	},
	(table) => {
		return {
			clerkIdIndex: index('clerk_id_index').on(table.clerkId),
		};
	},
);
