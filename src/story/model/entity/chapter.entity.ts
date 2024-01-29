import {
  Cascade,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Post } from '../../../posts/model/post.entity';

@Entity({ tableName: 'chapter' })
export class Chapter {
  @PrimaryKey({
    name: 'id',
    columnType: 'bigint',
    autoincrement: true,
  })
  id!: number;

  @Property({
    name: 'title',
    columnType: 'varchar(255)',
    nullable: false,
  })
  title!: string;

  @OneToMany({
    entity: () => Post,
    mappedBy: 'chapter',
    orphanRemoval: true,
    nullable: false,
    cascade: [Cascade.ALL],
  })
  posts!: Post[];
}
