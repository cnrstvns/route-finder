'use client';
import { Button } from '@/components/ui/button';
import { faPlus } from '@fortawesome/pro-regular-svg-icons/faPlus';
import { useCallback, useState } from 'react';
import {
	Dialog,
	DialogDescription,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/components/ui/dialog';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorLabel } from '@/components/ui/error-label';
import { Dropzone } from '@/components/ui/dropzone';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEmptySet } from '@fortawesome/pro-regular-svg-icons/faEmptySet';
import { trpc } from '@/app/_trpc/trpc';
import { toast } from 'sonner';

type FormValues = {
	name: string;
	iataCode: string;
	slug: string;
	logoPath: string;
};

const validationSchema = yup.object().shape({
	name: yup.string().required('A name is required.'),
	iataCode: yup
		.string()
		.required('An IATA code is required.')
		.length(2, 'An IATA code must be 2 characters.'),
	slug: yup.string().required('A slug is required.'),
	logoPath: yup.string().url().required('A logo is required.'),
});

const initialValues = {
	name: '',
	iataCode: '',
	slug: '',
	logoPath: '',
};

const AddAirline = () => {
	const [open, setOpen] = useState(false);
	const { mutateAsync } = trpc.admin.airline.create.useMutation({
		onSettled: (_data, error) => {
			if (error) {
				toast.error(error.message);
				return;
			}

			setOpen(false);
			toast.success('Airline created. Background task has been queued.');
		},
	});

	const handleSubmit = useCallback(
		async (values: FormValues) => {
			await mutateAsync(values);
		},
		[mutateAsync],
	);

	return (
		<div>
			<Dialog open={open} setOpen={setOpen}>
				<DialogTrigger asChild>
					<Button size="md" variant="secondary" icon={faPlus}>
						Add airline
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add airline</DialogTitle>
						<DialogDescription>
							Add an airline to RouteFinder. This will queue a background job to
							populate the airline's routes.
						</DialogDescription>
					</DialogHeader>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({
							isValid,
							getFieldProps,
							setFieldValue,
							values,
							isSubmitting,
						}) => (
							<Form className="mt-4 space-y-4">
								<div className="flex space-x-3 w-full">
									<div className="flex flex-col space-y-4 w-full">
										<div className="w-full">
											<Label htmlFor="name">Name</Label>
											<Input
												placeholder="Delta Airlines"
												{...getFieldProps('name')}
											/>
											<ErrorLabel name="name" />
										</div>
										<div className="w-full">
											<Label htmlFor="iataCode">IATA Code</Label>
											<Input placeholder="DL" {...getFieldProps('iataCode')} />
											<ErrorLabel name="iataCode" />
										</div>
									</div>

									<div className="flex justify-end w-full">
										{values.logoPath && (
											<div className="w-[132px] h-[132px]">
												<Image
													src={values.logoPath}
													height={132}
													width={132}
													alt={values.name}
													className="rounded border border-zinc-700 w-[132] h-[132px]"
												/>
											</div>
										)}
										{!values.logoPath && (
											<div className="w-[132px] h-[132px] rounded border border-zinc-700 flex items-center justify-center text-zinc-700">
												<FontAwesomeIcon
													icon={faEmptySet}
													className="h-7 w-7"
												/>
											</div>
										)}
									</div>
								</div>
								<div>
									<Label htmlFor="slug">Slug</Label>
									<Input
										placeholder="delta-airlines"
										{...getFieldProps('slug')}
									/>
									<ErrorLabel name="slug" />
								</div>
								<div>
									<Label>Logo</Label>
									<Dropzone
										endpoint="airlineLogo"
										onUploadComplete={(files) => {
											console.log(files);
											setFieldValue('logoPath', files[0].url);
										}}
									/>
								</div>
								<div className="w-full flex justify-end">
									<Button
										size="md"
										type="submit"
										variant="default"
										disabled={!isValid || isSubmitting}
										loading={isSubmitting}
									>
										Submit
									</Button>
								</div>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export { AddAirline };
