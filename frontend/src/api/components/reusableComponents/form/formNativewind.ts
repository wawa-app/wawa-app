export const formTw = {
  fieldWrap: 'w-full',
  label: 'mb-2 text-sm font-bold text-neutral-700',
  labelDisabled: 'mb-2 text-sm font-bold text-neutral-500',
  helper: 'mt-2 text-xs text-neutral-500',
  helperError: 'mt-2 text-xs text-red-600',
  inputRow: 'h-14 flex-row items-center rounded-md border px-4',
  input: 'flex-1 text-base text-neutral-900',
  inputDisabled: 'flex-1 text-base text-neutral-600',
  leftIconWrap: 'mr-4 items-center justify-center',
  rightIconButton: 'ml-3 h-7 w-7 items-center justify-center rounded-full',
  rightIconStatic: 'ml-3 h-7 w-7 items-center justify-center rounded-full',
  defaultRow: 'border-transparent bg-white',
  focusedRow: 'border-black bg-white',
  errorRow: 'border-transparent bg-white',
  disabledRow: 'border-neutral-300 bg-neutral-200',
  iconDefault: '#000000',
  iconDisabled: '#3f3f46',
  iconError: '#000000',
} as const;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
