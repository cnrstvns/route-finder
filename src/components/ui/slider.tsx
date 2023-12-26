'use client';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useCallback, useState } from 'react';

type SliderProps = {
	onChange?: (values: number[]) => void;
};

const thumbPopoverClassName =
	'absolute z-10 group-active:z-20 border px-2 py-0.5 border-transparent group-active:rounded-md group-active:bg-neutral-50 group-active:border-neutral-200 group-active:border top-6 w-max -translate-x-[calc(50%-10px)] text-sm text-neutral-600 dark:text-zinc-300 dark:group-active:border-zinc-700 dark:group-active:bg-zinc-800';
const thumbClassName =
	'block group hover:shadow-md h-5 w-5 rounded-full border border-neutral-200 bg-white active:border-neutral-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-500 dark:bg-neutral-700 dark:active:border-zinc-400';

const Slider = ({ onChange }: SliderProps) => {
	const [minValue, setMinValue] = useState<number>(150);
	const [maxValue, setMaxValue] = useState<number>(330);

	const handleChange = useCallback(
		(values: number[]) => {
			setMinValue(values[0]);
			setMaxValue(values[1]);

			if (onChange) onChange(values);
		},
		[onChange],
	);

	return (
		<SliderPrimitive.Root
			onValueChange={handleChange}
			step={30}
			max={1200}
			min={30}
			defaultValue={[150, 330]}
			className="relative pb-5 flex w-full touch-none select-none items-center"
			minStepsBetweenThumbs={2}
		>
			<SliderPrimitive.Track className="relative h-2 w-full bg-neutral-200 dark:bg-zinc-700 grow overflow-hidden rounded-full bg-secondary">
				<SliderPrimitive.Range className="absolute h-full bg-sky-400 dark:bg-indigo-500" />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb className={thumbClassName}>
				<span className={thumbPopoverClassName}>{minValue / 60} hours</span>
			</SliderPrimitive.Thumb>
			<SliderPrimitive.Thumb className={thumbClassName}>
				<span className={thumbPopoverClassName}>{maxValue / 60} hours</span>
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Root>
	);
};

Slider.displayName = 'Slider';

export { Slider };
