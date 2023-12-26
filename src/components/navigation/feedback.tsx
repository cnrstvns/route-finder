'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/pro-solid-svg-icons/faMessage';
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons/faSpinnerThird';

type FormValues = {
	feedback: string;
};

const validationSchema = yup.object().shape({
	feedback: yup
		.string()
		.required('Please enter some feedback.')
		.min(15, 'Please write at least 15 characters.')
		.max(500, 'Please write no more than 500 characters.'),
});

const initialValues = {
	feedback: '',
};

const Feedback = () => {
	const [open, setOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = useCallback(async (values: FormValues) => {
		setSubmitting(true);
		const response = await fetch('/api/feedback', {
			method: 'POST',
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			setSubmitting(false);
			return toast.warning(
				'Looks like something went wrong. Please try again later.',
			);
		}

		setOpen(false);
		toast.success('Thank you! Your feedback has been recorded.');
		setSubmitting(false);
	}, []);

	return (
		<div className="w-full">
			<Dialog open={open} setOpen={setOpen}>
				<DialogTrigger asChild>
					<div className="flex text-sm font-medium w-full items-center gap-3 rounded-lg px-3 py-2 text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-300 active:bg-neutral-100 dark:active:bg-zinc-800 cursor-default">
						<FontAwesomeIcon icon={faMessage} className="h-4 w-4" />
						Leave feedback
					</div>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Feedback</DialogTitle>
						<DialogDescription>
							Missing something? Love the product? Feel free to let us know.
						</DialogDescription>
					</DialogHeader>

					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={handleSubmit}
					>
						{({ errors, isValid, getFieldProps }) => (
							<Form className="mt-4 space-y-4">
								<div>
									<Textarea
										placeholder="Some comments here..."
										rows={8}
										{...getFieldProps('feedback')}
									/>
									{errors.feedback && (
										<div className="text-red-400 mt-2 text-xs">
											{errors.feedback}
										</div>
									)}
								</div>
								<div className="w-full flex justify-end">
									<Button
										size="md"
										type="submit"
										variant="default"
										disabled={!isValid}
									>
										{submitting ? (
											<FontAwesomeIcon
												icon={faSpinnerThird}
												className="fa-spin"
											/>
										) : (
											'Submit'
										)}
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

export { Feedback };
