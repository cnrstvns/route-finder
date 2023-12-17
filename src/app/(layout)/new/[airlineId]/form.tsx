'use client';
import { Button } from '@/components/ui/button';
import { Listbox } from '@/components/ui/listbox';
import { Slider } from '@/components/ui/slider';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import posthog from 'posthog-js';
import { useCallback } from 'react';
import * as yup from 'yup';

type RouteFormProps = {
	aircraft: { id: number; iata_code: string; model_name: string }[];
	airline: string;
};

type FormValues = {
	aircraft: string[];
	maxDuration: string;
	minDuration: string;
};

const validationSchema = yup.object().shape({
	aircraft: yup.array().of(yup.string()).min(1),
	maxDuration: yup.number().required(),
	minDuration: yup.number().required(),
});

const initalValues = {
	minDuration: '150',
	maxDuration: '330',
	aircraft: [],
};

const RouteForm = ({ aircraft, airline }: RouteFormProps) => {
	const router = useRouter();

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const trueMax = Math.max(+values.minDuration, +values.maxDuration);
			const trueMin = Math.min(+values.minDuration, +values.maxDuration);

			posthog.capture('Searched for route', {
				minDuration: trueMin,
				maxDuration: trueMax,
				aircraft: values.aircraft.toString(),
				airline: airline,
			});

			router.push(
				`/new/routes?minDuration=${trueMin}&maxDuration=${trueMax}&aircraft=${values.aircraft.toString()}&airline=${airline}`,
			);
		},
		[airline, router],
	);

	return (
		<Formik
			isInitialValid={false}
			initialValues={initalValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			className="p-6 mt-4 mx-3"
		>
			{({ setFieldValue, isValid }) => (
				<Form className="mt-5 md:mt-4 mx-6 space-y-5">
					<div className="font-semibold text-md md:text-lg">
						How long would you like to fly?
					</div>

					<Slider
						onChange={(values) => {
							setFieldValue('minDuration', values[0]);
							setFieldValue('maxDuration', values[1]);
						}}
					/>

					<div>
						<div className="font-semibold text-md md:text-lg">
							What equipment would you like to fly?
						</div>
						<div className="text-sm text-neutral-500">
							Please choose at least one aircraft.
						</div>
					</div>
					<Listbox
						name="aircraft"
						items={aircraft.map((a) => ({
							label: `${a.model_name} (${a.iata_code})`,
							value: a.iata_code,
						}))}
						onChange={(values) => setFieldValue('aircraft', values)}
					/>

					<Button disabled={!isValid} size="md" variant="default" type="submit">
						Get recommended routes
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export { RouteForm };
