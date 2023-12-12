'use client';
import { cn } from '@/lib/utils';
import { faCheck } from '@fortawesome/pro-regular-svg-icons/faCheck';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons/faChevronDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Listbox as ListboxPrimitive, Transition } from '@headlessui/react';
import { Fragment, useCallback, useMemo, useState } from 'react';

type Item = { label: string; value: string };

type ListboxProps = {
	name: string;
	items: Item[];
	buttonClassName?: string;
	onChange?: (items: string[]) => void;
};

const Listbox = ({ name, items, buttonClassName, onChange }: ListboxProps) => {
	const [selected, setSelected] = useState<string[]>([]);

	const handleChange = useCallback(
		(selectedItems: string[]) => {
			setSelected(selectedItems);
			if (onChange) onChange(selectedItems);
		},
		[onChange],
	);

	const placeholderTitle = useMemo(() => {
		if (!selected.length) return 'Nothing selected...';

		const firstThree = selected.slice(0, 3);
		const rest = selected.slice(3);
		const restLength = rest.length;
		const formattedThree = firstThree.join(', ');

		if (restLength < 1) return formattedThree;

		return `${formattedThree}, ${restLength} more`;
	}, [selected]);

	return (
		<ListboxPrimitive
			name={name}
			value={selected}
			onChange={handleChange}
			multiple
		>
			<div className='relative mt-1 z-10'>
				<ListboxPrimitive.Button
					className={cn(
						'relative w-full cursor-pointer rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm',
						buttonClassName,
					)}
				>
					<span className='block truncate'>{placeholderTitle}</span>
					<span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
						<FontAwesomeIcon
							icon={faChevronDown}
							className='h-4 w-4 text-neutral-500'
						/>
					</span>
				</ListboxPrimitive.Button>
				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<ListboxPrimitive.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
						{items.map((item) => (
							<ListboxPrimitive.Option
								key={item.value}
								className={({ active }) =>
									cn('relative cursor-default select-none py-2 pl-10 pr-4', {
										'bg-sky-100 text-sky-900': active,
										'text-gray-900': !active,
									})
								}
								value={item.value}
							>
								{({ selected }) => (
									<>
										<span
											className={cn('block truncate font-normal', {
												'font-medium': selected,
											})}
										>
											{item.label}
										</span>
										{selected && (
											<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600'>
												<FontAwesomeIcon icon={faCheck} className='h-4 w-4' />
											</span>
										)}
									</>
								)}
							</ListboxPrimitive.Option>
						))}
					</ListboxPrimitive.Options>
				</Transition>
			</div>
		</ListboxPrimitive>
	);
};

Listbox.displayName = 'Listbox';

export { Listbox, type ListboxProps };
