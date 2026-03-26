import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

/**
 * Class-validator decorator that ensures at least one of the specified fields
 * is present and non-empty on the decorated class instance.
 *
 * Attach it to any one property of the class — the error will be reported on
 * that property if none of the listed fields are provided.
 *
 * @example
 * ```ts
 * \@AtLeastOneOf(['email', 'identityName'])
 * email?: string;
 * ```
 */
export function AtLeastOneOf(fields: string[], options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'atLeastOneOf',
      target: (object as { constructor: new () => unknown }).constructor,
      propertyName,
      constraints: fields,
      options: {
        message: `At least one of [${fields.join(', ')}] must be provided`,
        ...options,
      },
      validator: {
        validate(_: unknown, args: ValidationArguments) {
          const obj = args.object as Record<string, unknown>;
          return (args.constraints as string[]).some(
            (f) => obj[f] !== undefined && obj[f] !== null && obj[f] !== '',
          );
        },
      },
    });
  };
}
