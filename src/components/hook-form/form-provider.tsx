import type { UseFormReturn } from 'react-hook-form';

import { FormProvider as RHFForm } from 'react-hook-form';

// ----------------------------------------------------------------------

export type FormProps = {
  onSubmit?: () => void;
  children: React.ReactNode;
  methods: UseFormReturn<any>;
} & React.FormHTMLAttributes<HTMLFormElement>;

export function Form({ children, onSubmit, methods, ...other }: FormProps) {
  return (
    <RHFForm {...methods}>
      <form onSubmit={onSubmit} noValidate autoComplete="off" {...other}>
        {children}
      </form>
    </RHFForm>
  );
}
