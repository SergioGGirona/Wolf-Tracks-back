/* eslint-disable no-unused-vars */
export interface Repository<W extends { id: string | number }> {
  getAll(): Promise<W[]>;
  getById(id: W['id']): Promise<W>;
  create(newData: Omit<W, 'id'>): Promise<W>;
  update(id: W['id'], newData: Partial<W>): Promise<W>;
  delete?(id: W['id']): Promise<void>;
  login?({ key, value }: { key: string; value: string }): Promise<W>;
}
