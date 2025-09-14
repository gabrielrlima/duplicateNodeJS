import type { ZodTypeAny } from 'zod';

import dayjs from 'dayjs';

import { z as zod } from 'src/lib/zod-config';

// ----------------------------------------------------------------------

type MessageMapProps = {
  required?: string;
  invalid_type?: string;
};

export const schemaHelper = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props?: { message?: MessageMapProps; isValid?: (text: string) => boolean }) =>
    zod
      .string({
        required_error: props?.message?.required ?? 'Número de telefone é obrigatório!',
        invalid_type_error: props?.message?.invalid_type ?? 'Número de telefone inválido!',
      })
      .min(1, { message: props?.message?.required ?? 'Número de telefone é obrigatório!' })
      .refine((data) => props?.isValid?.(data), {
        message: props?.message?.invalid_type ?? 'Número de telefone inválido!',
      }),
  /**
   * Date
   * Apply for date pickers.
   */
  date: (props?: { message?: MessageMapProps }) =>
    zod.coerce
      .date()
      .nullable()
      .transform((dateString, ctx) => {
        const date = dayjs(dateString).format();

        const stringToDate = zod.string().pipe(zod.coerce.date());

        if (!dateString) {
          ctx.addIssue({
            code: zod.ZodIssueCode.custom,
            message: props?.message?.required ?? 'Data é obrigatória!',
          });
          return null;
        }

        if (!stringToDate.safeParse(date).success) {
          ctx.addIssue({
            code: zod.ZodIssueCode.invalid_date,
            message: props?.message?.invalid_type ?? 'Invalid Date!!',
          });
        }

        return date;
      })
      .pipe(zod.union([zod.number(), zod.string(), zod.date(), zod.null()])),
  /**
   * Editor
   * defaultValue === '' | <p></p>
   * Apply for editor
   */
  editor: (props?: { message: string }) =>
    zod.string().min(8, { message: props?.message ?? 'Conteúdo é obrigatório!' }),
  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: <T extends ZodTypeAny>(schema: T, options?: { message?: string }) =>
    schema.nullable().transform((val, ctx) => {
      if (val === null || val === undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: options?.message ?? 'Field can not be null!',
        });
        return val;
      }
      return val;
    }),
  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props?: { message: string }) =>
    zod.boolean({ coerce: true }).refine((val) => val === true, {
      message: props?.message ?? 'Campo é obrigatório!',
    }),
  /**
   * Slider
   * Apply for slider with range [min, max].
   */
  sliderRange: (props: { message?: string; min: number; max: number }) =>
    zod
      .number()
      .array()
      .refine((data) => data[0] >= props?.min && data[1] <= props?.max, {
        message: props.message ?? `Intervalo deve estar entre ${props?.min} e ${props?.max}`,
      }),
  /**
   * File
   * Apply for upload single file.
   */
  file: (props?: { message?: string; required?: boolean }) =>
    zod.custom<File | string | null>().transform((data, ctx) => {
      const hasFile = data instanceof File || (typeof data === 'string' && !!data.length);
      const isRequired = props?.required !== false; // Por padrão é obrigatório, exceto se explicitamente definido como false

      if (!hasFile && isRequired) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'Arquivo é obrigatório!',
        });
        return null;
      }

      return data;
    }),
  /**
   * Files
   * Apply for upload multiple files.
   */
  files: (props?: { message: string; minFiles?: number }) =>
    zod.array(zod.custom<File | string>()).transform((data, ctx) => {
      const minFiles = props?.minFiles ?? 2;

      if (!data.length) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: props?.message ?? 'Arquivos são obrigatórios!',
        });
      } else if (data.length < minFiles) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `Selecione pelo menos ${minFiles} arquivos!`,
        });
      }

      return data;
    }),
};
