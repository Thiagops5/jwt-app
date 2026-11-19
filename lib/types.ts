// ===================================================================================================
// TIPOS: o formato dos dados que a API (jwt-api) devolve
// ===================================================================================================
// aqui a gente descreve o formato de cada coisa que vem do back-end pra o TypeScript avisar quando a gente errar o nome de um campo
// cada tipo é um espelho dos models do back (user.model.js, book.model.js...), então se mudar o model lá tem que mudar aqui também
// as datas chegam como string (o JSON não tem tipo Date), por isso são string e não Date

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  active: boolean; // false = atendente desativado (não consegue logar)
};

export type Category = {
  id: number;
  name: string;
  description: string | null;
};

export type Author = {
  id: number;
  name: string;
  nationality: string;
  birthDate: string;
};

export type Book = {
  id: number;
  title: string;
  isbn: string;
  year: number;
  description: string | null;
  totalCopies: number;
  availableCopies: number; // é esse campo que mostra "exemplares disponíveis" na tela
  categoryId: number | null;
  Category?: Category; // o back manda a categoria junto (include) no GET /books
  Authors?: Author[]; // e os autores também (relação N:N)
};

export type Reader = {
  id: number;
  name: string;
  cpf: number;
  email: string;
  phone: string | null;
};

export type LoanStatus = 'ATIVO' | 'DEVOLVIDO' | 'ATRASADO';

export type Loan = {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null; // null = ainda não devolveu
  status: LoanStatus;
  fine: number; // multa em reais (R$ 1,00 por dia de atraso)
  Book?: Book;
  Reader?: Reader;
  User?: User; // o atendente que registrou o empréstimo
};

// o que o GET /reports/dashboard devolve (os números dos cards)
export type DashboardData = {
  totalBooks: number;
  totalCopies: number;
  availableCopies: number;
  activeLoans: number;
  overdueLoans: number;
  totalFines: number;
};
