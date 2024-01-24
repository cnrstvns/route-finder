'use client';
import { forwardRef, useState } from 'react';
import { InputProps, Input } from './input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-regular-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/pro-regular-svg-icons/faEyeSlash';

const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggleShow = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input type={showPassword ? 'text' : 'password'} {...props} ref={ref} />
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          className="absolute right-3 cursor-pointer top-[50%] translate-y-[-50%] w-5 dark:text-zinc-400"
          onClick={handleToggleShow}
        />
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
