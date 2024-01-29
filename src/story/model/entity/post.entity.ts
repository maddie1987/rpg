import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Chapter } from './chapter.entity';

@Entity({ tableName: 'post' })
export class Post {
  @PrimaryKey({
    name: 'id',
    columnType: 'bigint',
    autoincrement: true,
  })
  id!: number;

  @Property({
    name: 'position',
    columnType: 'varchar(255)',
    nullable: false,
    index: true,
  })
  position!: string;

  @Property({
    name: 'text',
    columnType: 'mediumtext',
    nullable: false,
  })
  text!: string;

  @ManyToOne({
    entity: () => Chapter,
    nullable: false,
    joinColumn: 'chapter_id',
    columnType: 'bigint',
  })
  chapter!: Chapter;

  @Property({
    name: 'timestamp',
    columnType: 'timestamp',
    onUpdate: () => new Date(),
    onCreate: () => new Date(),
    nullable: false,
  })
  lastUpdate: Date;

  @Property({
    name: 'year',
    columnType: 'year',
    nullable: true,
  })
  year!: number;

  @Property({
    name: 'role_name',
    columnType: 'varchar(255)',
    nullable: false,
  })
  roleName!: string;
}
