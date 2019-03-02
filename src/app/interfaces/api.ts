import { User } from './user';

export interface Api {
    data: User[],
    page: number,
    per_page: number,
    total: number,
    total_pages: number
}
