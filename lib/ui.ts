// classes do Tailwind que se repetem nas telas, guardadas aqui pra todas ficarem com o mesmo visual
// as cores são as da Unipar que estão no globals.css (vermelho #C22820 e vinho #5C2034)
export const ui = {
  page: 'mx-auto w-full max-w-5xl px-6 py-8',
  title: 'mb-5 text-2xl font-bold text-[#5C2034]',
  card: 'mb-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm',
  form: 'grid gap-4 sm:grid-cols-2',
  label: 'flex flex-col gap-1.5 text-sm font-medium text-gray-700',
  input:
    'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-900 outline-none focus:border-[#C22820] focus:ring-1 focus:ring-[#C22820]',
  button:
    'cursor-pointer rounded-md bg-[#C22820] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a01f19] disabled:cursor-not-allowed disabled:opacity-60',
  buttonDanger:
    'cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-60',
  buttonLight:
    'cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60',
  link: 'text-sm font-medium text-[#C22820] hover:underline',
  error: 'text-sm font-medium text-red-600',
  table: 'w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-left text-sm shadow-sm',
  th: 'border-b border-gray-200 bg-gray-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600',
  td: 'border-b border-gray-100 px-4 py-3 align-middle text-gray-800',
};
