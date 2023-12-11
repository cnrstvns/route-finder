'use client';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useState } from 'react';

type SliderProps = {
  onChange?: (values: number[]) => void;
};

const Slider = ({ onChange }: SliderProps) => {
  const [minValue, setMinValue] = useState<number>(150);
  const [maxValue, setMaxValue] = useState<number>(330);

  const handleChange = (values: number[]) => {
    setMinValue(values[0]);
    setMaxValue(values[1]);

    if (onChange) onChange(values);
  };

  return (
    <SliderPrimitive.Root
      onValueChange={handleChange}
      step={30}
      max={1200}
      min={30}
      defaultValue={[150, 330]}
      className="relative pb-5 flex w-full touch-none select-none items-center"
      minStepsBetweenThumbs={1}
    >
      <SliderPrimitive.Track className="relative h-2 w-full bg-neutral-200 grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-sky-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block cursor-pointer hover:shadow-md h-5 w-5 rounded-full border border-neutral-200 bg-white active:border-neutral-300 focus:outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50">
        <span className="absolute top-6 w-max -left-[90%] text-sm text-neutral-600">
          {minValue / 60} hours
        </span>
      </SliderPrimitive.Thumb>
      <SliderPrimitive.Thumb className="block cursor-pointer hover:shadow-md h-5 w-5 rounded-full border border-neutral-200 bg-white active:border-neutral-300 focus:outline-none transition-all duration-200 disabled:pointer-events-none disabled:opacity-50">
        <span className="absolute top-6 w-max -left-[90%] text-sm text-neutral-600">
          {maxValue / 60} hours
        </span>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};

Slider.displayName = 'Slider';

export { Slider, type SliderProps };
