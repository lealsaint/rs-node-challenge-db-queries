import { getRepository, Repository } from 'typeorm';
import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :title", { title: `%${param}%` })
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.query("SELECT COUNT(id) AS count FROM games");
    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder()
      .select("users")
      .from(User, "users")
      .where("users.id IN (SELECT \"usersId\" FROM users_games_games WHERE \"gamesId\" = :id)", { id })
      .getMany();

    return users;
  }
}
