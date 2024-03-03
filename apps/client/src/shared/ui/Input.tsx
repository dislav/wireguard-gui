import { forwardRef } from 'react';
import { cn, Input as NextInput, InputProps } from '@nextui-org/react';

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ classNames, variant = 'bordered', ...props }, ref) => {
        return (
            <NextInput
                classNames={{
                    ...classNames,
                    inputWrapper: cn(classNames?.inputWrapper, 'shadow-none'),
                }}
                variant={variant}
                {...props}
                ref={ref}
            />
        );
    }
);

export default Input;
