export const dateToString = (
  input: string | Date | null | undefined
): string => (input ? new Date(input).toISOString().split('T')[0] : '');
