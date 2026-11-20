// classes do Tailwind que se repetem nas telas, guardadas aqui pra todas ficarem com o mesmo visual
// as cores são as da Unipar que estão no globals.css (vermelho #C22820 e vinho #5C2034)
export const ui = {
  page: 'mx-auto w-full max-w-5xl p-6',
  title: 'mb-4 text-2xl font-bold text-[#5C2034]',
  card: 'mb-6 rounded border border-gray-200 bg-white p-4 shadow-sm',
  form: 'grid gap-3 sm:grid-cols-2',
  label: 'flex flex-col gap-1 text-sm font-medium',
  input: 'rounded border border-gray-300 bg-white px-3 py-2 text-sm font-normal',
  button: 'cursor-pointer rounded bg-[#C22820] px-4 py-2 text-sm font-medium text-white hover:bg-[#a01f19] disabled:cursor-not-allowed disabled:opacity-60',
  buttonDanger: 'cursor-pointer rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60',
  buttonLight: 'cursor-pointer rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium hover:bg-gray-100 disabled:opacity-60',
  link: 'text-sm font-medium text-[#C22820] hover:underline',
  error: 'text-sm text-red-600',
  table: 'w-full border-collapse bg-white text-left text-sm shadow-sm',
  th: 'border-b border-gray-200 bg-gray-100 px-3 py-2 font-semibold',
  td: 'border-b border-gray-100 px-3 py-2 align-middle',
};
